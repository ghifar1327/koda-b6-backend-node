import { GenerateHash } from "../lib/hash.js";
import * as  userModels from "../models/users.model.js";
import {constants} from "http2";


/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
*/
export async function createUser(req, res) {

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
export async function getAllUser(req,res) {
    const users = await userModels.getAllUsers();
    res.json({
        success: true,
        message: "list of users",
        result: users
    });
}


export async function getUserById(req, res) {
    try{

        const id = parseInt(req.params.id);
        const user = await userModels.getUserByid(id);
        
        if (!user) throw new Error("User not found" );

        res.json({
            success: true,
            message: "data of user",
            resust: user
        });
    }catch(err){
        res.status(404).json({ message: err.message });
    }
}

export async function UpdateUser(req, res) {
    try {
      const id = parseInt(req.params.id);
      const user = userModels.updateUser(id, req.body);
      if (!user) throw new Error("User not found" );
      
        res.status(200).json({
          success: true,
          message: "updated successfuly",
          resust: user
      });
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
}

export async function deleteUser(req, res) {
    try{
      const id = parseInt(req.params.id);
      const user = userModels.deleteUser(id);
        res.status(200).json({
        success: true,
        message: "deleted successfuly",
        resust: user
      });
    }catch(err){
        res.status(404).json({ message: err.message });
    }
}