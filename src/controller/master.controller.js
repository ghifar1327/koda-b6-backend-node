import * as masterModel from "../models/master.models.js";

const ALLOWED_TABLES = ["sizes", "variants", "methods"];

/**
 * Validasi white list table
 * @param {string} table
 */
function validateTable(table) {
  if (!ALLOWED_TABLES.includes(table)) {
    const err = new Error("Invalid master table");
    err.status = 400;
    throw err;
  }
}

/**
 * Create master data
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function createMaster(req, res) {
  try {
    const { table } = req.params;
    const { name, add_price } = req.body;

    validateTable(table);

    const result = await masterModel.createMaster(table, {
      name,
      add_price,
    });

    res.status(201).json({
      success: true,
      message: `${table} created successfully`,
      results: result,
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message,
    });
  }
}

/**
 * Get all master data
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function getAllMaster(req, res) {
  try {
    const { table } = req.params;

    validateTable(table);

    const result = await masterModel.getAllMaster(table);

    res.status(200).json({
      success: true,
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
 * Get master by ID
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function getMasterById(req, res) {
  try {
    const { table, id } = req.params;

    validateTable(table);

    const result = await masterModel.getMasterById(table, id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Data not found",
      });
    }

    res.status(200).json({
      success: true,
      message: `${table} retrieved successfully`,
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
 * Update master data
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function updateMaster(req, res) {
  try {
    const { table, id } = req.params;
    const { name, add_price } = req.body;

    validateTable(table);

    const result = await masterModel.updateMaster(table, id, {
      name,
      add_price,
    });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Data not found",
      });
    }

    res.status(200).json({
      success: true,
      message: `${table} updated successfully`,
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
 * Delete master data
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function deleteMaster(req, res) {
  try {
    const { table, id } = req.params;

    validateTable(table);

    const result = await masterModel.deleteMaster(table, id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Data not found",
      });
    }

    res.status(200).json({
      success: true,
      message: `${table} deleted successfully`,
      results: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}