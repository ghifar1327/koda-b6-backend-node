import express from "express";
import * as productController from "../controller/product.controller.js";

const productRouter = express.Router();

// PUBLIC
productRouter.get("/", productController.getAllProducts);
productRouter.get("/:id", productController.getProductById);
productRouter.get("/:id/variants", productController.getVariantsByProductId);
productRouter.get("/:id/sizes", productController.getSizesByProductId);

// PRIVATE (ADMIN)
productRouter.post("/", productController.createProduct);
productRouter.put("/:id", productController.updateProduct);
productRouter.delete("/:id", productController.deleteProduct);

export default productRouter;