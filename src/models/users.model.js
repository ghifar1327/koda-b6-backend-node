import { pool } from "../lib/db.js";
import { v4 as uuidv4 } from 'uuid';

export async function getUserByid(id){
    const result = await pool.query(`
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
     	   		u.updated_at FROM users u
            JOIN role r ON u.role_id = r.id
          WHERE u.id = $1`,
         [id]
     );    return result.rows[0];
}

export async function getuserbyEmail(email){
    const result = await pool.query(`
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
     	   		u.updated_at FROM users u
            JOIN role r ON u.role_id = r.id 
         WHERE email = $1;`,
        [email]
        );
    return result.rows[0];
}

export async function getAllUsers(){
    const {rows:data} = await pool.query(`
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
    			u.updated_at FROM users u
          JOIN role r ON u.role_id = r.id
          ORDER BY created_at DESC`
        );
  return data;
}

export async function createUser(data) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const id = uuidv4();

    // get role_id
    const roleResult = await client.query(
      `SELECT id FROM role WHERE name = $1`,
      [data.role]
    );

    if (roleResult.rows.length === 0) {
      throw new Error(`Role '${data.role}' not found`);
    }

    const roleId = roleResult.rows[0].id;

    // insert new user
    const result = await client.query(
      `
      INSERT INTO users 
      (id, full_name, email, password, address, phone, role_id, created_at) 
      VALUES 
      ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, full_name, email, role_id, created_at
      `,
      [
        id,
        data.full_name,
        data.email,
        data.password,
        data.address,
        data.phone,
        roleId,
        new Date(),
      ]
    );

    await client.query("COMMIT");

    return result.rows;

  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

  export async function updateUser(id, data){
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      // get role_id
      const roleResult = await client.query(
        `SELECT id FROM role WHERE name = $1`,
        [data.role]
      );

      if (roleResult.rows.length === 0) {
        throw new Error(`Role '${data.role}' not found`);
      }

      const roleId = roleResult.rows[0].id;
      
      // update user
      const result = await client.query(
      `UPDATE users 
        SET 
          picture=$1, 
          full_name=$2, 
          email=$3, 
          password=$4, 
          address=$5, 
          phone=$6, 
          role_id=$7,
          updated_at=$8 
        WHERE id=$9
        RETURNING id, full_name, email, updated_at`,
      [
        data.picture, 
        data.full_name, 
        data.email, 
        data.password, 
        data.address, 
        data.phone, 
        roleId, 
        new Date(), 
        id
      ]
    );
    return result.rows[0];
  }catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}


export async function deleteUser(id){
  const result = await pool.query(
    "DELETE FROM users WHERE id = $1 RETURNING id, full_name, email",
    [id]
  );
  return result.rows[0];
}