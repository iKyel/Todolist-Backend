import express from "express";
import { verifyToken } from "../middlewares/auth.middleware";

// controller
import { register, login, logout } from "../controllers/user.controller";

const userRouter = express.Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.post('/logout', logout)

export default userRouter;
