import express from "express";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import dotenv from "dotenv";
dotenv.config();

import "./config/passport.js"; 
import { connectDB } from "./config/db.js";

import destinationRoutes from "./routes/destinationRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import googleAuthRoutes from "./routes/authRoutes.js";

const app = express();
const port = 4000;

// Middleware setup
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());

app.use(session({
  secret: "keyboard cat",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.send("API Working");
});

app.use("/api/destinations", destinationRoutes);
app.use("/api/users", userRoutes);
app.use("/auth", googleAuthRoutes);

// ✅ Connect to MongoDB first, then start the server
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`✅ Server running on http://localhost:${port}`);
  });
}).catch((err) => {
  console.error("❌ Failed to connect to MongoDB:", err);
});
