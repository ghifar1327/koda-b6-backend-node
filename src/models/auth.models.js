import { pool } from "../lib/db.js";
import { GenerateOTP } from "../lib/otp.js";

export async function createForgotPwd(email) {
    const otp = GenerateOTP();
    const result = await pool.query(
        `INSERT INTO forgot_password (email, code) VALUES ($1, $2)
        RETURNING email, code;`,
        [email, otp]
    );
    return result.rows[0];
}

export async function getForgotPwdByEmail(email) {
    const result = await pool.query(`SELECT 
		email,
		code
		FROM forgot_password WHERE email=$1
        `,
        [email]        
    );
    return await result.rows[0];
}

export async function deleteForgotPwd(email) {
    await pool.query(`
        DELETE FROM forgot_password WHERE email=$1`, 
        [email]
    );
}

export async function updatePassword(email, pwd) {
    const result = await pool.query(
        "UPDATE users SET password = $1 WHERE email = $2;",
        [pwd ,email]
    );
    return result.rows[0];
}


export const updateUserPicture = async (id, picture) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // UPDATE
    const updateResult = await client.query(
      `
      UPDATE users 
      SET 
        picture = $1,
        updated_at = $2
      WHERE id = $3
      `,
      [picture, new Date(), id]
    );

    if (updateResult.rowCount === 0) {
      throw new Error("User not found");
    }

    // SELECT
    const result = await client.query(
      `
      SELECT 
        u.id, 
        u.full_name, 
        u.picture, 
        u.email,
        u.password,
        r.name as role, 
        u.phone, 
        u.address, 
        u.created_at, 
        u.updated_at 
      FROM users u
      JOIN role r ON u.role_id = r.id
      WHERE u.id = $1
      `,
      [id]
    );

    const user = result.rows[0];

    await client.query("COMMIT");

    return user;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};