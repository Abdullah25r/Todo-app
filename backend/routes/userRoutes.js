import express from "express";
import pool from "../models/onlinedb.js";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    console.log(result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});
router.post("/api/adduser", async (req, res) => {
  const {fname, lname, phone} = req.body;
  if (!fname || !lname || !phone) {
    return res.status(400).json({ error: "All fields (fname, lname, phone) are required" });
  }
  try{
  const result = await pool.query(`INSERT INTO users (fname,lname,phone) VALUES ($1,$2,$3) RETURNING *`, [fname,lname, phone]);
  if (result.rows.length === 0) {
    throw new Error("Insertion failed: No rows returned");
  }
  res.status(201).json(result.rows[0]);
}catch(err){
  res.status(500).json({ error: "Internal Server Error" });
  console.log(err);
}
});
router.delete("/api/delete/:id", async (req,res)=>{
  const {id} = req.params;
  try{
 const result =  await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
 if (result.rows.length === 0) {
  return res.status(404).json({ message: "User not found" });
}
  res.status(200).json({message: 'user deleted successfully.', deletedUser: result.rows[0]})
  }catch(err){
    res.status(500).json({message: 'server error'})
  }
})
router.put("/api/updateuser/:id",async (req,res)=>{
  const {id} = req.params
  const {fname,lname, phone} = req.body;
  try {
    const result = await pool.query(`UPDATE users SET fname = $1, lname = $2, phone = $3, updated_at = NOW() WHERE id = $4 RETURNING *`, [fname,lname,phone,id]);
    if(result.rows.length === 0){
      return res.status(404).json({message: 'user not found'});
    }
    res.status(200).json({message: 'user entered successfully', updatedData: result.rows[0]})
  } catch (error) {
    console.error(error)
    res.status(500).json({message: 'server error'});
  }
})
export default router;
