import * as productmodels from "../models/product.models.js";


export async function getAllProducts(req, res) {
  try {
    const products = await productmodels.getAllProducts();

    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      data: products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}


export async function getProductById(req, res) {
  try {
    const { id } = req.params;

    const product = await productmodels.getProductById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      data: product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}


export async function createProduct(req, res) {
  try {
    const product = await productmodels.createProduct(req.body);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}


export async function updateProduct(req, res) {
  try {
    const { id } = req.params;

    const product = await productmodels.updateProduct(id, req.body);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}


export async function deleteProduct(req, res) {
  try {
    const { id } = req.params;

    const product = await productmodels.deleteProduct(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}


export async function getVariantsByProductId(req, res) {
  try {
    const { id } = req.params;

    const variants = await productmodels.getVariantsByProductId(id);

    res.status(200).json({
      success: true,
      message: "Variants fetched successfully",
      data: variants,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}


export async function getSizesByProductId(req, res) {
  try {
    const { id } = req.params;

    const sizes = await productmodels.getSizesByProductId(id);

    res.status(200).json({
      success: true,
      message: "Sizes fetched successfully",
      data: sizes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}