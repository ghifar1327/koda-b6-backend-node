import express from "express";
import * as cartController from "../controller/cart.controller.js";

const cartRouter = express.Router();

cartRouter.post("/", cartController.addToCart);
cartRouter.get("/:user_id", cartController.getCartByUser);
cartRouter.put("/:id", cartController.updateCart);
cartRouter.delete("/:id", cartController.deleteCart);

export default cartRouter;