import { pool } from "../lib/db.js";

// ======================================    GET ALL PRODUCTS
export async function getAllProducts() {
  const result = await pool.query(`
    SELECT
      p.id,
      MIN(i.url) AS image,
      p.name,
      p.description,
      p.price,
      ARRAY_AGG(DISTINCT c.name) AS categories,
      COALESCE(AVG(rp.rating), 0) AS rating,
      p.stock,
      p.created_at,
      p.updated_at
    FROM products p
    LEFT JOIN product_images pi ON p.id = pi.product_id
    LEFT JOIN images i ON pi.image_id = i.id
    LEFT JOIN products_categories pc ON p.id = pc.product_id
    LEFT JOIN categories c ON pc.category_id = c.id
    LEFT JOIN transaction_details td ON p.id = td.product_id
    LEFT JOIN review_product rp ON td.id = rp.id_transaction_details
    GROUP BY p.id;
  `);

  return result.rows;
}

// =================================================================  GET PRODUCT BY ID
export async function getProductById(id) {
  const result = await pool.query(`
    SELECT
      p.id,
      MIN(i.url) AS image,
      p.name,
      p.description,
      p.price,
      ARRAY_AGG(DISTINCT c.name) AS categories,
      COALESCE(AVG(rp.rating), 0) AS rating,
      p.stock,
      p.created_at,
      p.updated_at
    FROM products p
    LEFT JOIN product_images pi ON p.id = pi.product_id
    LEFT JOIN images i ON pi.image_id = i.id
    LEFT JOIN products_categories pc ON p.id = pc.product_id
    LEFT JOIN categories c ON pc.category_id = c.id
    LEFT JOIN transaction_details td ON p.id = td.product_id
    LEFT JOIN review_product rp ON td.id = rp.id_transaction_details
    WHERE p.id = $1
    GROUP BY p.id;
  `, [id]);

  return result.rows[0];
}

// ==============================================================  CREATE PRODUCT
export async function createProduct(data) {
  const result = await pool.query(`
    INSERT INTO products (
      name,
      description,
      price,
      stock,
      created_at
    ) VALUES ($1, $2, $3, $4, $5)
    RETURNING id, name, price, stock, created_at;
  `, [
    data.name,
    data.description,
    data.price,
    data.stock,
    new Date()
  ]);

  return result.rows[0];
}

// ============================================================= UPDATE PRODUCT
export async function updateProduct(id, data) {
  const result = await pool.query(`
    UPDATE products
    SET 
      name = $1,
      description = $2,
      price = $3,
      stock = $4,
      updated_at = $5
    WHERE id = $6
    RETURNING id, name, price, stock, updated_at;
  `, [
    data.name,
    data.description,
    data.price,
    data.stock,
    new Date(),
    id
  ]);

  return result.rows[0];
}

// ================================================ DELETE PRODUCT
export async function deleteProduct(id) {
  const result = await pool.query(`
    DELETE FROM products
    WHERE id = $1
    RETURNING id, name;
  `, [id]);

  return result.rows[0];
}

// ================================================== get variants product id
export async function getVariantsByProductId(id) {
  const result = await pool.query(`
    SELECT
      v.id,
      COALESCE(v.name, '') AS name,
      COALESCE(v.add_price, 0) AS add_price
    FROM product_variants pv
    LEFT JOIN variants v ON pv.variant_id = v.id
    WHERE pv.product_id = $1;
  `, [id]);

  return result.rows;
}

// ====================================================== get size by product id
export async function getSizesByProductId(id) {
  const result = await pool.query(`
    SELECT
      s.id,
      COALESCE(s.name, '') AS name,
      COALESCE(s.add_price, 0) AS add_price
    FROM product_sizes ps
    LEFT JOIN sizes s ON ps.size_id = s.id
    WHERE ps.product_id = $1;
  `, [id]);

  return result.rows;
}