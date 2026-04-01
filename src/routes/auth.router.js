import { Router } from "express";
import * as authController from "../controller/auth.controller.js";

const authRouter = Router();

authRouter.post("/login", authController.login);
authRouter.post("/register", authController.register);
authRouter.post("/forgot-password", authController.forgotPwd);
authRouter.post("/reset-password", authController.resetPassword);

export default authRouter;
