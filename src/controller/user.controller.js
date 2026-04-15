import buildImageURL from "../lib/buildImageUrl.js";
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

        if (!user) throw new Error("Failed to create user" );
        
        res.status(constants.HTTP_STATUS_CREATED).json({
            success: true,
            message: "register success",
            result: user,
        });
    } catch (error) {
        res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
            success: false,
            message: error.message,
        });
    }
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
*/
export async function getAllUser(req,res) {
    try{
    const users = await userModels.getAllUsers();
    if (!users) throw new Error("Users not found" );
    res.status(constants.HTTP_STATUS_OK).json({
        success: true,
        message: "list of users",
        result: users
        });
    } catch (error) {
    res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message: error.message,
        }); 
    }
}


export async function getUserById(req, res) {
    try{

        const id = req.params.id;
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

export async function updateUser(req, res) {
  try {
    const id = req.params.id;
    let data = req.body ?? {};

    if (typeof data === "string") {
      try {
        data = JSON.parse(data);
      } catch {
        return res.status(400).json({
          success: false,
          message: "Invalid request body",
        });
      }
    }

    if (Object.keys(data).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No update data provided",
      });
    }

    // get previous data user by id
    const existing = await userModels.getUserByid(id);
    if (!existing) {
      throw new Error("User not found");
    }

    const password =
      data.password !== undefined
        ? await GenerateHash(data.password)
        : existing.password;
    
    // merge data with previous data
    const payload = {
      picture: data.picture ?? existing.picture,
      full_name: data.full_name ?? data.name ?? existing.full_name,
      email: data.email ?? existing.email,
      password,
      address: data.address ?? existing.address,
      phone: data.phone ?? existing.phone,
      role: data.role ?? existing.role,
    };

    const updated = await userModels.updateUser(id, payload);
    if (!updated) {
      throw new Error("Failed to update user");
    }

    const user = await userModels.getUserByid(id);
    user.picture = buildImageURL(req, user.picture);
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      results: user,
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({
      success: false,
      message: err.message,
    });
  }
}

export async function deleteUser(req, res) {
    try{
      const id = req.params.id;
      const user = await userModels.deleteUser(id);
    
      if (!user) throw new Error("User not found" );

      res.status(200).json({
        success: true,
        message: "deleted successfuly",
        result: user
      });
    }catch(err){
        res.status(404).json({
            success: false,
            message: err.message,
        });
    }
}
