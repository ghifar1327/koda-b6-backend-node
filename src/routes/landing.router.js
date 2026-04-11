import express from "express";
import * as landingController from "../controller/landing.controller.js";

const landingRouter = express.Router();

/**
 * @swagger
 * /landing/reviews:
 *   get:
 *     summary: Get all review products
 *     tags: [Landing]
 *     responses:
 *       200:
 *         description: List of review products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
landingRouter.get("/reviews", landingController.getAllReviewProducts);

/**
 * @swagger
 * /landing/reviews/{id}:
 *   get:
 *     summary: Get review product by ID
 *     tags: [Landing]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Review product details
 *       404:
 *         description: Product not found
 */
landingRouter.get("/reviews/:id", landingController.getReviewProductById);

/**
 * @swagger
 * /landing/recommended:
 *   get:
 *     summary: Get all recommended products
 *     tags: [Landing]
 *     responses:
 *       200:
 *         description: List of recommended products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
landingRouter.get("/recommended", landingController.getRecommendedProducts);

/**
 * @swagger
 * /landing/recommended/{id}:
 *   get:
 *     summary: Get recommended product by ID
 *     tags: [Landing]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Recommended product details
 *       404:
 *         description: Product not found
 */
landingRouter.get("/recommended/:id", landingController.getRecommendedProductById);

export default landingRouter;