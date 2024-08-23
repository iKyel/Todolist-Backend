import { Schema, model, Document, Types } from "mongoose";
import { WorkItem } from "./work.model"; // Import WorkItem interface
import mongoose from "mongoose";

export interface User extends Document {
  _id: string;
  fullName: string;
  username: string;
  password: string;
  workItems: mongoose.Types.ObjectId[]; 
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
    workItems: [
      {
        type: Schema.Types.ObjectId,
        ref: "WorkItem", // Reference to WorkItem model
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const UserModel = model<User>("User", UserSchema);