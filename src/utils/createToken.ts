import jwt from "jsonwebtoken";
import { Response } from "express";

const JWT_SECRET = process.env.JWT_SECRET || "";
const NODE_ENV = process.env.NODE_ENV || "development"; // Default to 'development'

const generationToken = (res: Response, userId: string): string => {
  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "30d" });

  // Determine secure flag based on NODE_ENV
  const isSecure = NODE_ENV !== "development";

  // Set JWT as an HTTP-only cookie
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: isSecure, 
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
  });

  return token;
};

export default generationToken;
