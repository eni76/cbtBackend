import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import cookieParser from "cookie-parser";
import userRouter from "./src/routers/userRouter";


// Import routers


// Load env variables
dotenv.config();

// Initialize app
const app = express();


// Middlewares
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://cbt-lime.vercel.app",
    ],
    credentials: true,
  })
);

// Test route

app.use('/', userRouter);
// Routes


// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
