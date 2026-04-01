import { pool } from "../lib/db.js";

/**
 * Create data ke table dynamic
 * @param {string} table
 * @param {{name: string, add_price: number}} data
 */
export async function createMaster(table, data) {
  const query = `
    INSERT INTO ${table} (name, add_price)
    VALUES ($1, $2)
    RETURNING *
  `;

  const result = await pool.query(query, [data.name, data.add_price]);
  return result.rows[0];
}

/**
 * @param {string} table
 */
export async function getAllMaster(table) {
  const query = `
    SELECT id, name, add_price
    FROM ${table}
    ORDER BY id ASC
  `;

  const result = await pool.query(query);
  return result.rows;
}

/**
 * Get data by ID
 * @param {string} table
 * @param {number} id
 */
export async function getMasterById(table, id) {
  const query = `
    SELECT id, name, add_price
    FROM ${table}
    WHERE id = $1
  `;

  const result = await pool.query(query, [id]);

  return result.rows[0];
}

/**
 * Update data
 * @param {string} table
 * @param {number} id
 * @param {{name: string, add_price: number}} data
 */
export async function updateMaster(table, id, data) {
  const query = `
    UPDATE ${table}
    SET name = $1, add_price = $2
    WHERE id = $3
    RETURNING *
  `;

  const result = await pool.query(query, [
    data.name,
    data.add_price,
    id,
  ]);

  return result.rows[0];
}

/**
 * Delete data
 * @param {string} table
 * @param {number} id
 */
export async function deleteMaster(table, id) {
  const query = `
    DELETE FROM ${table}
    WHERE id = $1
    RETURNING *
  `;

  const result = await pool.query(query, [id]);

  return result.rows[0];
}