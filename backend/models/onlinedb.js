import pg from "pg";
const { Pool } = pg;
import env from "dotenv";
env.config();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});
pool
  .connect()
  .then(() => console.log("database connected successfully"))
  .catch((err) => console.log("error in database", err));
export default pool;