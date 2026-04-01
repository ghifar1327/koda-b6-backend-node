import "dotenv/config";
import express from "express";
import db from "./lib/db.js";
import adminRouter from "./routes/admin.router.js";
import authRouter from "./routes/auth.router.js";
import auth from "./middleware/auth.middleware.js";

export const conn = db();
const app = express();

app.use(express.json());

app.use("admin",auth ,adminRouter);
app.use("/auth", authRouter);
app.get("/", function(req, res){
    res.json({
        success : true,
        message: "backend is running"
    });
});

app.listen(9999, function(){
    console.log("App listening on port 9999");
});