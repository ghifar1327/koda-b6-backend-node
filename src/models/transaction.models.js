import { pool } from "../lib/db.js";
import { v4 as uuidv4 } from "uuid";

/**
 * Create transaction
 */
export async function createTransaction(data) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const transactionId = uuidv4();

    await client.query(
      `INSERT INTO transactions (
        id, 
        user_id, 
        address, 
        status,
        id_method, 
        payment_method, 
        id_voucher,
        created_at, 
        updated_at
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,NOW(),NOW())`,
      [
        transactionId,
        data.user_id,
        data.address,
        "pending",
        data.id_method,
        data.payment_method,
        data.id_voucher,
      ]
    );
    const cartItems = await client.query(
      `SELECT 
          id,
          product_id, 
          size_id,
          variant_id,
          quantity
        FROM cart WHERE user_id = $1`, [data.user_id]);


    for (const cartItem of cartItems.rows) {
      await client.query(
        `INSERT INTO transaction_details(
          transaction_id, product_id, size_id, variant_id, quantity
        ) VALUES ($1,$2,$3,$4,$5)`,
        [
          transactionId,
          cartItem.product_id,
          cartItem.size_id,
          cartItem.variant_id,
          cartItem.quantity,
        ]
      );

      const result = await client.query(
        `UPDATE products
         SET stock = stock - $1
         WHERE id = $2 AND stock >= $1`,
        [cartItem.quantity, cartItem.product_id]
      );

      if (result.rowCount === 0) {
        throw new Error("Stock not enough");
      }
      
    }

    
    // DETELE CART
    for (const cartItem of cartItems.rows) {
      if (cartItem.id) {
        await client.query(
          `DELETE FROM cart WHERE id = $1`,
          [cartItem.id]
        );
      }
    }
    
    await client.query("COMMIT");
    return transactionId;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}


/**
 * Get all transactions
 */
export async function getAllTransactions() {
  const query = `
    SELECT
      t.id,
      u.id AS user_id,
      u.full_name,
      t.address,
      u.phone,
      m.name AS shipping,
      t.payment_method,
      t.status,
      t.created_at,
      t.updated_at,

      p.name AS product_name,
      img.url AS product_image,
      s.name AS size,
      v.name AS variant,
      td.quantity,

      (p.price + COALESCE(s.add_price,0) + COALESCE(v.add_price,0)) * td.quantity AS subtotal

    FROM transactions t
    JOIN users u ON u.id = t.user_id
    JOIN methods m ON m.id = t.id_method

    JOIN transaction_details td ON td.transaction_id = t.id
    JOIN products p ON p.id = td.product_id

    LEFT JOIN sizes s ON s.id = td.size_id
    LEFT JOIN variants v ON v.id = td.variant_id

    LEFT JOIN product_images pi ON pi.product_id = p.id
    LEFT JOIN images img ON img.id = pi.image_id

    ORDER BY t.created_at DESC;
  `;

  const { rows } = await pool.query(query);

  const map = {};

  for (const r of rows) {
    if (!map[r.id]) {
      map[r.id] = {
        id: r.id,
        user_id: r.user_id,
        full_name: r.full_name,
        address: r.address,
        phone: r.phone,
        shipping: r.shipping,
        payment_method: r.payment_method,
        status: r.status,
        created_at: r.created_at,
        items: [],
        total_transaction: 0,
      };
    }

    map[r.id].items.push({
      transaction_id: r.id,
      product_name: r.product_name,
      product_image: r.product_image,
      size: r.size,
      variant: r.variant,
      quantity: r.quantity,
      subtotal: Number(r.subtotal),
    });

    map[r.id].total_transaction += Number(r.subtotal);
  }

  return Object.values(map);
}

/**
 * Get transaction by ID
 */
export async function getTransactionById(id) {
  const query = `
    SELECT
      t.id,
      u.id AS user_id,
      u.full_name,
      t.address,
      u.phone,
      m.name AS shipping,
      t.payment_method,
      t.status,
      t.created_at,
      t.updated_at,

      p.name AS product_name,
      img.url AS product_image,
      s.name AS size,
      v.name AS variant,
      td.quantity,

      (p.price + COALESCE(s.add_price,0) + COALESCE(v.add_price,0)) * td.quantity AS subtotal

    FROM transactions t
    JOIN users u ON u.id = t.user_id
    JOIN methods m ON m.id = t.id_method

    JOIN transaction_details td ON td.transaction_id = t.id
    JOIN products p ON p.id = td.product_id

    LEFT JOIN sizes s ON s.id = td.size_id
    LEFT JOIN variants v ON v.id = td.variant_id

    LEFT JOIN product_images pi ON pi.product_id = p.id
    LEFT JOIN images img ON img.id = pi.image_id

    WHERE t.id = $1;
  `;

  const { rows } = await pool.query(query, [id]);

  if (rows.length === 0) return null;

  const trx = {
    id: rows[0].id,
    user_id: rows[0].user_id,
    full_name: rows[0].full_name,
    address: rows[0].address,
    phone: rows[0].phone,
    shipping: rows[0].shipping,
    payment_method: rows[0].payment_method,
    status: rows[0].status,
    created_at: rows[0].created_at,
    updated_at: rows[0].updated_at,
    items: [],
    total_transaction: 0,
  };

  for (const r of rows) {
    trx.items.push({
      transaction_id: r.id,
      product_name: r.product_name,
      product_image: r.product_image,
      size: r.size,
      variant: r.variant,
      quantity: r.quantity,
      subtotal: Number(r.subtotal),
    });

    trx.total_transaction += Number(r.subtotal);
  }

  return trx;
}


/**
 * Update transaction status
 */
export async function updateTransaction(id, status) {
  const query = `
    UPDATE transactions
    SET status = $1, updated_at = NOW()
    WHERE id = $2
  `;

  await pool.query(query, [status, id]);
}

/**
 * Delete transaction
 */
export async function deleteTransaction(id) {
  await pool.query(`DELETE FROM transactions WHERE id = $1`, [id]);
}

/**
 * Get transactions by user ID
 */
export async function getTransactionsByUserId(userId) {
  const query = `
    SELECT
      t.id,
      u.id AS user_id,
      u.full_name,
      t.address,
      u.phone,
      m.name AS shipping,
      t.payment_method,
      t.status,
      t.created_at,
      t.updated_at,

      p.name AS product_name,
      img.url AS product_image,
      s.name AS size,
      v.name AS variant,
      td.quantity,

      (p.price + COALESCE(s.add_price,0) + COALESCE(v.add_price,0)) * td.quantity AS subtotal

    FROM transactions t
    JOIN users u ON u.id = t.user_id
    JOIN methods m ON m.id = t.id_method

    JOIN transaction_details td ON td.transaction_id = t.id
    JOIN products p ON p.id = td.product_id

    LEFT JOIN sizes s ON s.id = td.size_id
    LEFT JOIN variants v ON v.id = td.variant_id

    LEFT JOIN product_images pi ON pi.product_id = p.id
    LEFT JOIN images img ON img.id = pi.image_id

    WHERE u.id = $1;
  `;

  const { rows } = await pool.query(query, [userId]);

  const map = {};

  for (const r of rows) {
    if (!map[r.id]) {
      map[r.id] = {
        id: r.id,
        user_id: r.user_id,
        full_name: r.full_name,
        address: r.address,
        phone: r.phone,
        shipping: r.shipping,
        payment_method: r.payment_method,
        status: r.status,
        created_at: r.created_at,
        updated_at: r.updated_at,
        items: [],
        total_transaction: 0,
      };
    }

    map[r.id].items.push({
      transaction_id: r.id,
      product_name: r.product_name,
      product_image: r.product_image,
      size: r.size,
      variant: r.variant,
      quantity: r.quantity,
      subtotal: Number(r.subtotal),
    });

    map[r.id].total_transaction += Number(r.subtotal);
  }

  return Object.values(map);
}