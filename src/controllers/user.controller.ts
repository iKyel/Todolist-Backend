import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel, User } from "../models/user.models";
import { Request, Response } from "express";
import generationToken from "../utils/createToken";
import { AuthenticatedRequest } from "../interface/AutheticatedRequest";

const jwtSecret = process.env.JWT_SECRET || "";



/* Dang ky */
export const register = async (req: Request, res: Response) => {
  try {
    const { fullName, username, password } = req.body;
    const userExist = await UserModel.findOne({ username });
    if (userExist) {
      res.status(400).send("Da ton tai user");
    }
    const salt = await bcrypt.genSalt(); // create random salt
    const passwordHash = await bcrypt.hash(password, salt); // hash password with salt

    const newUser = new UserModel({
      fullName,
      username,
      password: passwordHash,
    });

    const savedUser = await newUser.save();
    generationToken(res, savedUser._id);
    res.status(201).json(savedUser);
  } catch (err: any) {
    res.status(500).json({
      error: err.message,
    });
  }
};

/* Dang nhap */
export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const user = await UserModel.findOne({ username: username });
    if (!user) {
      return res.status(401).json({ error: "Nguoi dung khong ton tai!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Mat khau khong chinh xac" });
    }

    generationToken(res, user._id);
    const { password: _, ...userWithoutPassword } = user.toObject();
    res.json({
      user: userWithoutPassword,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};


export const logout = async (req: Request, res: Response) => {
  try {
    res.cookie("jwt", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    res.status(200).json({ message: "Dang xuat thanh cong" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
/* Lay thong tin user hien tai (Get Current User Profile) */
export const getCurrentUserProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user?._id) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const user = (await UserModel.findById(req.user._id)) as User | null;
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
