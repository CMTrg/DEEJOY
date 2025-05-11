import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"
import destinationRoutes from "./routes/destinationRoutes.js"
import userRoutes from "./routes/userRoutes.js"

const app = express()
const port = 4000

app.use(express.json())
app.use(cors())

connectDB()

app.get("/",(req,res)=>{
    res.send(`API Working`)
})

app.use("/api/destinations", destinationRoutes);

app.listen(port,()=>{
    console.log(`http://localhost:${port} started`)
})