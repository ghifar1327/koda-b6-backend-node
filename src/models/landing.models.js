import { pool } from "../lib/db.js";

/**
 * Get all review products (landing)
 */
export async function getAllReviewProductsLanding() {
  const query = `
    SELECT 
      p.id,
      p.name,
      i.url AS image,
      p.description,
      p.price,
      COUNT(rp.id) AS total_review
    FROM review_product rp
    JOIN transaction_details td ON rp.id_transaction_details = td.id
    JOIN products p ON td.product_id = p.id
    LEFT JOIN product_images pi ON p.id = pi.product_id
    LEFT JOIN images i ON pi.image_id = i.id
    GROUP BY p.id, p.name, i.url, p.description, p.price
    ORDER BY total_review DESC
  `;

  const result = await pool.query(query);
  return result.rows;
}

/**
 * Get review product by ID
 * @param {number} id
 */
export async function getReviewProductLandingById(id) {
  const query = `
    SELECT 
      p.id,
      p.name,
      i.url AS image,
      p.description,
      p.price,
      COUNT(rp.id) AS total_review
    FROM review_product rp
    JOIN transaction_details td ON rp.id_transaction_details = td.id
    JOIN products p ON td.product_id = p.id
    LEFT JOIN product_images pi ON p.id = pi.product_id
    LEFT JOIN images i ON pi.image_id = i.id
    WHERE p.id = $1
    GROUP BY p.id, p.name, i.url, p.description, p.price
  `;

  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
}

/**
 * Get recommended products (top rating)
 */
export async function getRecommendedProducts() {
  const query = `
    SELECT 
      p.id,
      p.name,
      i.url AS image,
      p.description,
      p.price,
      COUNT(rp.id) AS total_review,
      AVG(rp.rating) AS avg_rating
    FROM review_product rp
    JOIN transaction_details td ON rp.id_transaction_details = td.id
    JOIN products p ON td.product_id = p.id
    LEFT JOIN product_images pi ON p.id = pi.product_id
    LEFT JOIN images i ON pi.image_id = i.id
    GROUP BY p.id, p.name, i.url, p.description, p.price
    ORDER BY avg_rating DESC
    LIMIT 4
  `;

  const result = await pool.query(query);
  return result.rows;
}

/**
 * Get recommended product by ID
 * @param {number} id
 */
export async function getRecommendedProductById(id) {
  const query = `
    SELECT 
      p.id,
      p.name,
      i.url AS image,
      p.description,
      p.price,
      COUNT(DISTINCT rp.id) AS total_review,
      AVG(rp.rating) AS avg_rating
    FROM review_product rp
    JOIN transaction_details td ON rp.id_transaction_details = td.id
    JOIN products p ON td.product_id = p.id
    LEFT JOIN product_images pi ON p.id = pi.product_id
    LEFT JOIN images i ON pi.image_id = i.id
    WHERE p.id = $1
    GROUP BY p.id, p.name, i.url, p.description, p.price
  `;

  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
}