import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel, User } from "../models/user.models";
import { Request, Response } from "express";
import { AuthenticatedRequest } from "../interface/AutheticatedRequest";
import { WorkItemModel } from "../models/work.model";

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
      workItems: [],
    });

    const savedUser = await newUser.save();
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

    const token = jwt.sign(
      { id: user._id, username: user.username },
      jwtSecret,
      { expiresIn: "1hr" }
    );
    return res
      .status(201)
      .json({ status: true, message: "Dang nhap thanh cong", token: token });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Dang xuat
export const logout = async (req: Request, res: Response) => {
  try {
    res.status(200).json({ message: "Dang xuat thanh cong" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

/* Lay thong tin user hien tai (Get Current User Profile) */
export const getCurrentUserProfile = (
  req: AuthenticatedRequest,
  res: Response
) => {
  const user = req.user;
  const userData = {
    id: user?.id,
    fullName: user?.fullName,
    username: user?.username,
    workItems: user?.workItems,
  };
  return res
    .status(201)
    .json({ status: true, message: "Profile Data", data: userData });
};

/* Lay thong tin work item cua user */
export const getWorkItem = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await UserModel.findById(userId).populate({
      path: "workItems"
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res
      .status(200)
      .json({ status: true, message: "Work Items", data: user.workItems });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
