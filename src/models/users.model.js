import { pool } from "../lib/db.js";

export async function getUserByid(id){
    const result = await pool.query(`
     SELECT 
         name, 
         email, 
         password
         FROM users WHERE id = $1`,
         [id]
     )
    return result.rows[0]
}

export async function getuserbyEmail(email){
    const result = await pool.query(`
        SELECT 
            name, 
            email, 
            password
            FROM users WHERE email = $1`,
            [email]
        )
    return result.rows[0]
}

export async function getAllUsers(){
    const {rows:data} = await pool.query("SELECT name, email, password FROM users");
return data
}

export async function createUser(data){
  const result = await pool.query(
    `INSERT INTO users (name, email, password)
     VALUES ($1, $2, $3)
     RETURNING id, name, email, password`,
    [data.name, data.email, data.password]
  );
  return result.rows[0];
}

export async function updateUser(id, data){
    const result = await pool.query(
    `UPDATE users 
     SET name = $1, email = $2, password = $3
     WHERE id = $4
     RETURNING id, name, email, password`,
    [data.name, data.email, data.password, id]
  );
  return result.rows[0];
}


export async function deleteUser(id){
  const result = await pool.query(
    "DELETE FROM users WHERE id = $1 RETURNING id, name, email",
    [id]
  );
  return result.rows[0];
}