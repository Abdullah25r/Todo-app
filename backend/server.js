import express from 'express'
import userRoutes from './routes/userRoutes.js'
const app = express();
const PORT = 3000;
app.use(express.json());
app.use("/users", userRoutes)
app.get("/",(req,res)=>{
    res.send("hello world")
})
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
