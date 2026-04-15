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
    SELECT 
	   c.id ,
     i.url AS product_image,
     p.name AS product_name,
     s.name AS size,
     v.name AS variant,
     c.quantity,
     ((p.price + COALESCE(s.add_price, 0) + COALESCE(v.add_price, 0)) * c.quantity) AS subtotal
    FROM cart c
    JOIN products p ON c.product_id = p.id
    LEFT JOIN sizes s ON c.size_id = s.id
    LEFT JOIN variants v ON c.variant_id = v.id
    LEFT JOIN product_images pi ON p.id = pi.product_id
    LEFT JOIN images i ON pi.image_id = i.id
    WHERE c.user_id = $1
    ORDER BY c.id ASC
  `;

  const result = await pool.query(query, [user_id]);

  return result.rows;
}



/**
 * @param {number} id
 * @returns {Promise<Array>}
 */
export async function deleteCart(id) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // get user_id
    const userResult = await client.query(
      `SELECT user_id FROM cart WHERE id = $1`,
      [id]
    );

    if (userResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return null;
    }

    const userId = userResult.rows[0].user_id;

    // delete cart
    await client.query(
      `DELETE FROM cart WHERE id = $1`,
      [id]
    );

    await client.query("COMMIT");

    // Fetch updated cart after deletion
    const cartResult = await pool.query(
      `
      SELECT 
        c.id,
        i.url AS product_image,
        p.name AS product_name,
        s.name AS size,
        v.name AS variant,
        c.quantity,
        ((p.price + COALESCE(s.add_price, 0) + COALESCE(v.add_price, 0)) * c.quantity) AS subtotal
      FROM cart c
      JOIN products p ON c.product_id = p.id
      LEFT JOIN sizes s ON c.size_id = s.id
      LEFT JOIN variants v ON c.variant_id = v.id
      LEFT JOIN product_images pi ON p.id = pi.product_id
      LEFT JOIN images i ON pi.image_id = i.id
      WHERE c.user_id = $1
      ORDER BY c.id ASC
      `,
      [userId]
    );

    return cartResult.rows;

  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}