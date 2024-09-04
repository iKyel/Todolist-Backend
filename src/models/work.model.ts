import { Schema, model, Document, Types } from "mongoose";

export interface WorkItem extends Document {
  text: string;
  completed: boolean;
  user: Types.ObjectId; // Reference to User
}

// Mongoose Schema
const WorkItemSchema = new Schema<WorkItem>(
  {
    text: {
      type: String,
      required: [true, "Hãy điền công việc"],
    },
    completed: {
      type: Boolean,
      required: false,
      default: false,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const WorkItemModel = model<WorkItem>("WorkItem", WorkItemSchema);