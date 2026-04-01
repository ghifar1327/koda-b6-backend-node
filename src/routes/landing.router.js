import express from "express";
import * as landingController from "../controller/landing.controller.js";

const landingRouter = express.Router();

// Review products
landingRouter.get("/reviews", landingController.getAllReviewProducts);
landingRouter.get("/reviews/:id", landingController.getReviewProductById);

// Recommended products
landingRouter.get("/recommended", landingController.getRecommendedProducts);
landingRouter.get("/recommended/:id", landingController.getRecommendedProductById);

export default landingRouter;