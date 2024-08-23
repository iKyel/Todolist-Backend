import jwt from "jsonwebtoken";
import { User, UserModel } from "../models/user.models"; 
import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../interface/AutheticatedRequest";

const authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  let token = req.cookies.jwt; 

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
      
      // Find the user and exclude the password field
      const user = await UserModel.findById(decoded.userId).select("-password").exec();

      if (!user) {
        res.status(401);
        throw new Error("User not found");
      }

      req.user = user as User; 
      next(); 
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  } else {
    res.status(401).json({ error: "Authentication failed, no token provided" });
  }
};

export default authenticate;
