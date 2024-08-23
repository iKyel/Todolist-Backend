import express from "express";

// controller
import { register, login, logout, getCurrentUserProfile } from "../controllers/user.controller";
import authenticate from "../middlewares/auth.middleware";

const userRouter = express.Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.post('/logout', logout)
userRouter.get('/profile', getCurrentUserProfile)

export default userRouter;
