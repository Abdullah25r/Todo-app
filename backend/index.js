import express from "express";
import cors from "cors";
import { deleteTodos, fetchData, insertTodos, updateData } from "./models/db.js";
import bodyParser from "body-parser";
import env from 'dotenv'
env.config();
const app = express();
const port = process.env.PORT;
app.use(bodyParser.urlencoded({ extended: true }));
// Middleware to handle CORS

app.use(cors());
app.use(express.json());

// put data into db
app.post("/api/addtodo", async (req, res) => {
  try {
    const item = req.body.inputValue;
    const result = await insertTodos(item);
    res.status(201).json(result);
  } catch (error) {
    console.error("Error inserting todo:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/gettodo", async (req, res) => {
  try {
    const data = await fetchData("todo");
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch todos" }); // Send a 500 error response with a JSON message
  }
});
app.delete("/api/deltodo/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await deleteTodos(id);
    res.status(200).json({ message: "Todo deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "server error" });
  }
});

app.put("/api/updatetodo/:id", async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: "Text field is required" });
  }

  try {
    const result = await updateData(id, text);
    res.json({ success: true, id, text });
  } catch (err) {
    console.error("Update failed:", err);
    res.status(500).json({ error: "Failed to update item" });
  }
});



// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
