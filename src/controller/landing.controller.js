import * as landingModel from "../models/landing.models.js";

/**
 * Get all review products (landing)
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function getAllReviewProducts(req, res) {
  try {
    const result = await landingModel.getAllReviewProductsLanding();

    if (!result) {
      throw new Error("Failed to retrieve review products");
    }
    res.status(200).json({
      success: true,
      message: "Review products retrieved successfully",
      results: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

/**
 * Get review product by ID
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function getReviewProductById(req, res) {
  try {
    const { id } = req.params;

    const result = await landingModel.getReviewProductLandingById(id);

    if (!result) {
      throw new Error("Failed to retrieve review product");
    }
    res.status(200).json({
      success: true,
      message: "Review product retrieved successfully",
      results: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

/**
 * Get recommended products
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function getRecommendedProducts(req, res) {
  try {
    const result = await landingModel.getRecommendedProducts();

    if (!result) {
      throw new Error("Failed to retrieve recommended products");
    }
    res.status(200).json({
      success: true,
      message: "Recommended products retrieved successfully",
      results: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

/**
 * Get recommended product by ID
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function getRecommendedProductById(req, res) {
  try {
    const { id } = req.params;

    const result = await landingModel.getRecommendedProductById(id);

     if (!result) {
      throw new Error("Failed to retrieve recommended products");
    }

    res.status(200).json({
      success: true,
      message: "Recommended product retrieved successfully",
      results: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}