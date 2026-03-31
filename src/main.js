import "dotenv/config";
import express from "express"
import userRouter from "./routes/users.router.js"
import db from "./lib/db.js";

export const conn = db()
const app = express()

app.use(express.json())
app.use("/users", userRouter)
app.get("/", function(req, res){
    res.json({
        success : true,
        message: "backend is running"
    })
})

app.listen(9999, function(){
    console.log("App listening on port 9999")
})