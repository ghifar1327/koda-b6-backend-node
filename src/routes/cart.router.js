import express from "express";
import * as cartController from "../controller/cart.controller.js";

const cartRouter = express.Router();

/**
 * @swagger
 * /cart:
 *   post:
 *     summary: Add item to cart
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *               product_id:
 *                 type: integer
 *               size_id:
 *                 type: integer
 *               variant_id:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Item added to cart successfully
 *       400:
 *         description: Bad request
 */
cartRouter.post("/", cartController.addToCart);

/**
 * @swagger
 * /cart/{user_id}:
 *   get:
 *     summary: Get cart by user ID
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User's cart items
 *       404:
 *         description: User not found
 */
cartRouter.get("/:user_id", cartController.getCartByIdUser);

/**
 * @swagger
 * /cart/{id}:
 *   put:
 *     summary: Update cart item
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Cart item updated
 *       404:
 *         description: Cart item not found
 */
cartRouter.put("/:id", cartController.updateCart);

/**
 * @swagger
 * /cart/{id}:
 *   delete:
 *     summary: Delete cart item
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Cart item deleted
 *       404:
 *         description: Cart item not found
 */
cartRouter.delete("/:id", cartController.deleteCart);

export default cartRouter;