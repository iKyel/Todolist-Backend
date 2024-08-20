import { Schema, model, Document } from "mongoose";

export interface WorkItem extends Document {
  text: string;
  completed: boolean;
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
  },
  {
    timestamps: true,
  }
);

export const WorkItemModel = model<WorkItem>("WorkItem", WorkItemSchema);
