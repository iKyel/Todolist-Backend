// Package cần thiết
import express from "express";
import cors from "cors";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import workRouter from "./routes/work.route";

// db
import connectDB from "./connection/db";

// Routes

dotenv.config(); // Load các biến môi trường từ file .env

// variables
const app = express();
const port = process.env.PORT || 3000;

// sử dụng CORS Middleware
app.use(cors());

// sử dụng middleware để phân tích dữ liệu JSON
app.use(express.json());

// route
app.use("/api/works", workRouter)

// Ket noi db
connectDB();

// Ket noi server
app.listen(port, () => {
  console.log(`Server dang chay tren cong http://localhost:${port}`);
});
