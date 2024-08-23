import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface IUserPayload {
  id: string;
}

interface IRequest extends Request {
  user?: IUserPayload;
}

const JWT_SECRET = process.env.JWT_SECRET || "";

// Middleware to verify JWT tokens
export const verifyToken = async (
  req: IRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token = req.header("Authorization");

    if (!token) {
        res.status(403).send("Access denied");
        return;
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7); // Remove "Bearer " from the token
    }

    const verified = jwt.verify(token, JWT_SECRET) as IUserPayload;
    req.user = verified;
    next();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
