import * as userModels from "../models/users.model.js";
import * as authModels from "../models/auth.models.js";
import {constants} from "node:http2";
import { GenerateToken } from "../lib/jwt.js";
import { GenerateHash, VerifyHash } from "../lib/hash.js";
import buildImageURL from "../lib/buildImageUrl.js";
import { validate as isUUID } from "uuid";


/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function register(req, res) {
  try {
    const { full_name, email, password, address, phone } = req.body;

    if (!email.includes("@") || !email.includes(".com")) {
      return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message: "Invalid email format"
      });
    }
    if (password.length < 5) {
      return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message: "Password must be at least 5 characters"
      });
    }

    const existingUser = await userModels.getuserbyEmail(email);
    if (existingUser) {
      return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message: "Email already registered"
      });
    }

    const hash = await GenerateHash(password);

    const reqData = {
      full_name,
      email,
      password: hash,
      address,
      phone,
      role: "user"
    };

    const user = await userModels.createUser(reqData);

    res.status(constants.HTTP_STATUS_CREATED).json({
      success: true,
      message: "register success",
      result: user,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "failed to register",
      error: error.message,
    });
  }
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function login(req, res) {
    try{
        const {email , password} = req.body;
        if (!email || !password) {
          return res.status(400).json({
            success: false,
            message: "Email and password are required"
          });
        }
        
        const user = await userModels.getuserbyEmail(email);

        if (!user) {
           return res.status(constants.HTTP_STATUS_UNAUTHORIZED).json({
             success: false,
             message: "Invalid email or password"
           });
         }
        
        const isValid = await VerifyHash(user.password, password);
        
          if (!isValid) {
            return res.status(constants.HTTP_STATUS_UNAUTHORIZED).json({
              success: false,
              message: "Invalid email or password"
            });
          }
      const token = await GenerateToken(user);
      
      user.picture = buildImageURL(req, user.picture);
       res.status(constants.HTTP_STATUS_OK).json({
         success: true,
         message: "Login success",
         user: {
           id: user.id,
           picture: user.picture,
           full_name: user.full_name,
           email: user.email,
           address: user.address,
           phone: user.phone,
           role: user.role
         },
         token
        });
        

    }catch(err){
      res.status(500).json({
      success: false,
      message: err.message
    });
    }
}


/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function forgotPwd(req, res) {
  try{
    const {email}= req.body;
    const user = await userModels.getuserbyEmail(email);
    if(!user){
      return res.status(constants.HTTP_STATUS_NOT_FOUND).json({
        success: false, 
        message: "email not registed"
      });
    }
    // delete data lama untuk create ulang
    await authModels.deleteForgotPwd(email);
    
    const data = await authModels.createForgotPwd(email);
    console.log("OTP:", data.code,", email:", email);
    return res.json({
            success: true,
            message: "OTP sent",
            otp: data.code
      });

  }catch(err){
    return res.status(500).json({
            success: false,
            message: err.message
    });
  }
}


export async function resetPassword(req, res) {
    try {
        const { email, code, new_password } = req.body;

        const data = await authModels.getForgotPwdByEmail(email);

        if (!data) {
            return res.status(400).json({
                success: false,
                message: "OTP not found"
            });
        }

        if (data.code !== code) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }

        const hash = await GenerateHash(new_password);

        await authModels.updatePassword(email, hash);

        await authModels.deleteForgotPwd(email);

        return res.json({
            success: true,
            message: "Password updated successfully"
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}


export const uploadPicture = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isUUID(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user id",
      });
    }


    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Picture is required",
      });
    }

    const picture = "/uploads/" + req.file.filename;

    const user = await authModels.updateUserPicture(id, picture);

    user.picture = buildImageURL(req, user.picture);
    return res.json({
      success: true,
      message: "Picture updated successfully",
      user: user,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};