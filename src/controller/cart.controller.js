import * as cartModel from "../models/cart.models.js";

/**
 * Add to cart (auto merge quantity)
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function addToCart(req, res) {
  try {
    const { user_id, product_id, size_id, variant_id, quantity } = req.body;

    if (!user_id || !product_id || !size_id || !variant_id || !quantity) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    if (quantity <= 0){
        return res.status(400).json({
        success: false,
        message: "invalid quantity",
      });
    }
    // cek existing cart
    const existing = await cartModel.findExistingCart({
      user_id,
      product_id,
      size_id,
      variant_id,
    });

    let result;

    if (existing) {
      // update quantity jika ada cart indentik
      const newQty = existing.quantity + quantity;

      result = await cartModel.updateCartQuantity(existing.id, newQty);
    } else {
      // kalau tidak ada insert baru
      result = await cartModel.addCart({
        user_id,
        product_id,
        size_id,
        variant_id,
        quantity,
      });
    }

    res.status(200).json({
      success: true,
      message: "Cart updated",
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
 * Get cart by user
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function getCartByIdUser(req, res) {
  try {
    const { user_id } = req.params;

    const result = await cartModel.getCartByIdUser(user_id);

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
 * Update quantity
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function updateCart(req, res) {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const result = await cartModel.updateCartQuantity(id, quantity);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Cart updated",
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
 * Delete cart
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function deleteCart(req, res) {
  try {
    const { id } = req.params;

    const result = await cartModel.deleteCart(id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Cart deleted",
      results: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}