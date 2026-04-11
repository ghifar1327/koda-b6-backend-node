import { pool } from "../lib/db.js";

/**
 * @param {{user_id: string, product_id: number, size_id: number, variant_id: number}} data
 */
export async function findExistingCart(data) {
  const query = `
    SELECT id, user_id, product_id, size_id, variant_id, quantity
    FROM cart
    WHERE user_id = $1 
      AND product_id = $2 
      AND size_id = $3 
      AND variant_id = $4
  `;

  const result = await pool.query(query, [
    data.user_id,
    data.product_id,
    data.size_id,
    data.variant_id,
  ]);

  return result.rows[0] || null;
}

/**
 * @param {{user_id: string, product_id: number, size_id: number, variant_id: number, quantity: number}} data
 */
export async function addCart(data) {
  const query = `
    INSERT INTO cart (user_id, product_id, size_id, variant_id, quantity)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, user_id, product_id, size_id, variant_id, quantity
  `;

  const result = await pool.query(query, [
    data.user_id,
    data.product_id,
    data.size_id,
    data.variant_id,
    data.quantity,
  ]);

  return result.rows[0];
}

/**
 * @param {number} id
 * @param {number} quantity
 */
export async function updateCartQuantity(id, quantity) {
  const query = `
    UPDATE cart
    SET quantity = $1
    WHERE id = $2
    RETURNING id, user_id, product_id, size_id, variant_id, quantity
  `;

  const result = await pool.query(query, [quantity, id]);

  return result.rows[0] || null;
}

/**
 * @param {string} user_id
 */
export async function getCartByIdUser(user_id) {
  const query = `
    SELECT id, product_id, size_id, variant_id, quantity
    FROM cart
    WHERE user_id = $1
    ORDER BY id ASC
  `;

  const result = await pool.query(query, [user_id]);

  return result.rows;
}

/**
 * @param {number} id
 */
export async function deleteCart(id) {
  const query = `
    DELETE FROM cart
    WHERE id = $1
    RETURNING id
  `;

  const result = await pool.query(query, [id]);

  return result.rows[0] || null;
}