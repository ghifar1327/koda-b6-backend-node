import * as landingModel from "../models/landing.model.js";

/**
 * Get all review products (landing)
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function getAllReviewProducts(req, res) {
  try {
    const result = await landingModel.getAllReviewProductsLanding();

    res.status(200).json({
      success: true,
      data: result,
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
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: result,
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

    res.status(200).json({
      success: true,
      data: result,
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
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}