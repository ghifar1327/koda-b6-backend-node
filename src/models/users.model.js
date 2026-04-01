import { pool } from "../lib/db.js";
import { v4 as uuidv4 } from 'uuid';

export async function getUserByid(id){
    const result = await pool.query(`
     SELECT 
    			id, 
    			full_name, 
    			picture, 
    			email,
    			password,
    			role_id, 
    			phone, 
    			address, 
    			created_at, 
    			updated_at FROM users WHERE id = $1;`,
         [id]
     );
    return result.rows[0];
}

export async function getuserbyEmail(email){
    const result = await pool.query(`
      SELECT 
     			id, 
     			full_name, 
     			picture, 
     			email,
     			password,
     			role_id, 
     			phone, 
     			address, 
     			created_at, 
     			updated_at FROM users WHERE email = $1;`,
        [email]
        );
    return result.rows[0];
}

export async function getAllUsers(){
    const {rows:data} = await pool.query(`
     SELECT 
    			id, 
    			full_name, 
    			picture, 
    			email,
    			password,
    			role_id, 
    			phone, 
    			address, 
    			created_at, 
    			updated_at FROM users`
        );
  return data;
}

export async function createUser(data){
  const id = uuidv4();
  const result = await pool.query(`
    INSERT INTO users 
    (id, full_name, email, password, address, phone, role_id,created_at) 
    VALUES 
    ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [id, data.full_name, data.email, data.password, data.address, data.phone, data.role_id, new Date()]
  );
  return result.rows[0];
}

  export async function updateUser(id, data){
      const result = await pool.query(
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
        RETURNING `,
      [data.picture, data.full_name, data.email, data.password, data.address, data.phone, data.role_id, new Date(), id]
    );
    return result.rows[0];
  }


export async function deleteUser(id){
  const result = await pool.query(
    "DELETE FROM users WHERE id = $1 RETURNING id, full_name, email",
    [id]
  );
  return result.rows[0];
}