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