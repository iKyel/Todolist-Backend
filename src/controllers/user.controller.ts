import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel, User } from "../models/user.models";
import { Request, Response } from "express";
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

export const logout = async (req: Request, res: Response) => {
  try {
    res.status(200).json({ message: "Dang xuat thanh cong" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
/* Lay thong tin user hien tai (Get Current User Profile) */
export const getCurrentUserProfile = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const token = req.headers?.authorization?.split(" ")[1];
    if (!token) {
      return res.status(400).json({
        status: false,
        message: "Access Denined",
      });
    }
    jwt.verify(token, jwtSecret, async (err, decode) => {
      if (err) {
        return res
          .status(401)
          .json({ status: false, message: "Invalid token" });
      }

      if (typeof decode === "object" && "id" in decode) {
        const user = await UserModel.findById(decode.id);
        if (!user)
          return res
            .status(400)
            .json({ status: false, message: "Invalid Token" });
        const userData = {
          id: user?.id,
          fullName: user?.fullName,
          username: user?.username,
        };
        return res
          .status(201)
          .json({ status: true, message: "Profile Data", data: userData });
      } else {
        return res
          .status(400)
          .json({ status: false, message: "Invalid token payload" });
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
