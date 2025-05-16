import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import destinationRoutes from "./routes/destinationRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();
const port = 4000;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true               
}));

app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.send(`API Working`);
});

app.use("/api/destinations", destinationRoutes);
app.use("/api/users", userRoutes);

app.listen(port, () => {
  console.log(`http://localhost:${port} started`);
});
