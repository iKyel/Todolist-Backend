import express from "express";

// middlewares
import { verifyToken } from "../middlewares/verifyToken.middleware";

// controller
import { register, login, logout, getCurrentUserProfile, getWorkItem } from "../controllers/user.controller";

const userRouter = express.Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.post('/logout', logout)
userRouter.get('/profile', verifyToken, getCurrentUserProfile)
userRouter.get('/works', verifyToken, getWorkItem)

export default userRouter;
