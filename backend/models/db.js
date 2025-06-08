import pg from "pg";
import env from 'dotenv'
// Create a pool instead of a client to handle multiple connections more efficiently
// const pool = new pg.Pool({
//   user: "postgres",
//   host: "localhost",
//   database: "Class",
//   password: "bhatti",
//   port: 5432,
// });
env.config();
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export async function insertTodos(item) {
  try {
    const result = await pool.query(
      `INSERT INTO todo (items) VALUES ($1) RETURNING *`,
      [item]
    );
    if (result.rows.length === 0) {
      throw new Error("Insertion failed: No rows returned");
    }
    return result.rows[0];
  } catch (error) {
    console.error("Error inserting todo:", error);
    throw error;
  }
}

//delete todos
export async function deleteTodos(id) {
  try {
    await pool.query(`DELETE FROM todo WHERE id = $1`, [id]);
  } catch (error) {
    console.log(error);
  }
}

// Fetch data from the 'todo' table
export async function fetchData(table) {
  try {
    const result = await pool.query(`SELECT * FROM ${table}`);
    return result.rows; 
  } catch (err) {
    console.error("Error fetching data:", err);
    throw err; 
  }
}
export async function updateData(id, text) {
  try {
    await pool.query("UPDATE todo SET items = $1 WHERE id = $2", [text, id]);
    return { success: true };
  } catch (err) {
    console.error("Database update error:", err);
    throw err; 
  }
}
