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

    res.json({
      workItems,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

const fetchWorkItemById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const workItem = await WorkItem.findOne({ _id: req.params.id });

    if (workItem) {
      return res.json(workItem);
    } else {
      res
        .status(404)
        .json({
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
    const workItem = new WorkItem({
      text,
      completed,
    });

    // Lưu WorkItem vào database
    const savedWorkItem = await workItem.save();

    // Tìm User theo userId và thêm workItem vào danh sách
    await UserModel.findByIdAndUpdate(userId, {
      $push: { workItems: savedWorkItem._id },
    });

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
    });
    console.log(workItem)

    if (workItem) {
      // Xóa workItem khỏi danh sách của User
      await UserModel.findByIdAndUpdate(userId, {
        $pull: { workItems: req.params.id },
      });
      res.json({ message: "Đã xoá công việc" });
    } else {
      res
        .status(404)
        .json({
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

    const workItem = await WorkItem.findOneAndUpdate(
      { _id: req.params.id },
      { text, completed },
      { new: true }
    );

    if (workItem) {
      res.json(workItem);
    } else {
      res
        .status(404)
        .json({
          error: "Không tìm thấy công việc hoặc không có quyền truy cập",
        });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const fetchCompletedWorkItems = async (req: Request, res: Response) => {
  try {
    const workItems = await WorkItem.find({ completed: true });
    res.json(workItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

const fetchIncompleteWorkItems = async (req: Request, res: Response) => {
  try {
    const workItems = await WorkItem.find({ completed: false });
    res.json(workItems);
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
  fetchCompletedWorkItems,
  fetchIncompleteWorkItems,
};
