import { verifyToken } from "../lib/jwt.js";
/**
 * 
 * @param {import{"express"}.request} req 
 * @param {import{"express"}.response} res 
 * @param {import{"express"}.NexFunction} next 
 */
export default function auth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = verifyToken(token);

    if (!payload) {
      throw new Error("Invalid token");
    }

    res.locals.user = payload;

    next();
  } catch (err) {
    console.log(err);
    return res.status().json({
      success: false,
      message: "Unauthorized",
    });
  }
}