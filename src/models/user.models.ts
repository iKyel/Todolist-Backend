import { Schema, model, Document, Types } from "mongoose";

export interface User extends Document {
  _id: string;
  fullName: string;
  username: string;
  password: string;
}

// Mongoose Schema
const UserSchema = new Schema<User>(
  {
    fullName: {
      type: String,
      required: [true, "Phải nhập họ tên!"],
      min: 3,
      max: 100,
    },
    username: {
      type: String,
      required: [true, "Phải nhập tên đăng nhập!"],
      unique: true,
      max: 50,
    },
    password: {
      type: String,
      required: [true, "Phải nhập mật khẩu!"],
      min: 8,
    },
  },
  {
    timestamps: true,
  }
);

export const UserModel = model<User>("User", UserSchema);