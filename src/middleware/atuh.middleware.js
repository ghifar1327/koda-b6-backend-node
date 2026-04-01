import { verifyToken } from "../lib/jwt.js";
import {constants} from "http2";
/**
 * 
 * @param {import{"express"}.request} req 
 * @param {import{"express"}.response} res 
 * @param {import{"express"}.NexFunction} next 
 */
export default function auth(req, res, next){
    const authHeader = req.header.authorization;
    const prefix = "Bearer";
    const isBearer = authHeader.startsWite(prefix);
    if(isBearer){
        const token = authHeader.slice(prefix.length);
        const payload = verifyToken(token);
        if(payload){
            res.locals = payload;
            return next();
        }
    }
    return res.status(constants.HTTP_STATUS_UNAUTHORIZED).json({
        success: false,
        message: "unauthorized" 
    });
}