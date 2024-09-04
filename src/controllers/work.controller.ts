import { Request, Response } from "express";
import { WorkItemModel as WorkItem } from "../models/work.model";
import { AuthenticatedRequest } from "../interface/AutheticatedRequest";
import { UserModel } from "../models/user.models";

const fetchWorkItems = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const keyword = req.query.keyword
      ? {
          text: {
            $regex: req.query.keyword as string,
            $options: "i",
          },
        }
      : {};

    const completedFilter = req.body.completed !== undefined
      ? { completed: req.body.completed === true }
      : {};

    const workItems = await WorkItem.find({ ...keyword, ...completedFilter });

    res.json({ workItems });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

const fetchWorkItemById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const workItem = await WorkItem.findOne({ _id: req.params.id });

    if (workItem) {
      return res.json(workItem);
    } else {
      res.status(404).json({
        error: "Không tìm thấy công việc hoặc không có quyền truy cập",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: "Work item not found" });
  }
};

const addWorkItem = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { text, completed } = req.body;
    const userId = req.user?._id;

    if (!text) {
      return res.status(400).json({ error: "Phải có Text" });
    }

    // Tạo mới WorkItem
    const workItem = new WorkItem({ text, completed, user: userId });

    // Lưu WorkItem vào database
    const savedWorkItem = await workItem.save();

    res.status(201).json(savedWorkItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

const removeWorkItem = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const workItem = await WorkItem.findOneAndDelete({
      _id: req.params.id,
      user: userId,
    });

    if (workItem) {
      res.json({ message: "Đã xoá công việc" });
    } else {
      res.status(404).json({
        error: "Không tìm thấy công việc hoặc không có quyền truy cập",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const updateWorkItemDetails = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { text, completed } = req.body;
    const userId = req.user?._id;

    // Tìm và cập nhật WorkItem dựa trên _id và user
    const workItem = await WorkItem.findOneAndUpdate(
      { _id: req.params.id, user: userId },
      { text, completed },
      { new: true } // Trả về tài liệu đã được cập nhật
    );

    if (workItem) {
      res.json(workItem);
    } else {
      res.status(404).json({
        error: "Không tìm thấy công việc hoặc không có quyền truy cập",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const fetchWorkItemsByUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const workItems = await WorkItem.find({ user: userId });

    res.json({ workItems });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

export {
  fetchWorkItems,
  fetchWorkItemById,
  addWorkItem,
  removeWorkItem,
  updateWorkItemDetails,
  fetchWorkItemsByUser
};