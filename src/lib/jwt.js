import jwt from "jsonwebtoken";

const SECRET = process.env.APP_SECRET;

export function GenerateToken(user){
    const payload = {
        id : user.id,
    };
    return jwt.sign(payload, SECRET, {expiresIn: "15m"});
}

export function verifyToken(token){
    try{
        const payload = jwt.verify(token, SECRET);
        return payload;
    }catch{
        return null;
    }
}