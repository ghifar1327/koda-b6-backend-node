import {Router} from 'express'
import * as userController from "../controller/user.controller.js"

const userRouter =  Router()

userRouter.post("", userController.createUser)
userRouter.get("", userController.getAllUser)
userRouter.get("/:id", userController.getUserById)
userRouter.patch("/:id", userController.UpdateUser)
userRouter.delete("/:id", userController.deleteUser)

export default userRouter