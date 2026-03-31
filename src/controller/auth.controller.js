import * as userModels from "../models/users.model.js";
import {constants} from "node:http2";


/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function register(req, res) {

    try {
        const user = await userModels.createUser(req.body);
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

        if (!user) {
        throw new Error("User not found");
        }
        
        if (password !== user.password) {
          throw new Error("Wrong email or password");
        }

       const result = {
         name: user.name,
         email: user.email
       };
       res.json({
         success: true,
         message: "Login success",
         results : result
    });


    }catch(err){
      res.status(constants.HTTP_STATUS_UNAUTHORIZED).json({
      success: false,
      message: err.message
    });
    }
}