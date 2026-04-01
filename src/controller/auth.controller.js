import * as userModels from "../models/users.model.js";
import {constants} from "node:http2";
import { GenerateToken } from "../lib/jwt.js";
import { GenerateHash, VerifyHash } from "../lib/hash.js";

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function register(req, res) {

    try {
        const {password } = req.body;
        const hash = await GenerateHash(password);
        const reqData = { ...req.body, password: hash };
        console.log(reqData);
        const user = await userModels.createUser(reqData);
        res.status(constants.HTTP_STATUS_CREATED).json({
            success: true,
            message: "register success",
            result: user,
        });
    } catch (error) {
        res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
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
        const user = await userModels.getuserbyEmail(email);

        console.log(user);
        if (!user) {
        throw new Error("User not found");
        }
        
        const isValid = VerifyHash(user.password, password);
        
        if (!isValid) {
          throw new Error("Wrong password");
        }
        const token = GenerateToken(user);

    //    const result = {
    //      name: user.name,
    //      email: user.email
         
    //    };
       res.json({
         success: true,
         message: "Login success",
         token : token
    });


    }catch(err){
      res.status(constants.HTTP_STATUS_UNAUTHORIZED).json({
      success: false,
      message: err.message
    });
    }
}