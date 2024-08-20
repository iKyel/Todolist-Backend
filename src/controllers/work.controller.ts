import { Request, Response } from "express";
import { WorkItemModel as WorkItem } from "../models/work.model";

const fetchWorkItems = async (req: Request, res: Response) => {
  try {
    const pageSize = 50;
    const keyword = req.query.keyword
      ? {
          text: {
            $regex: req.query.keyword as string,
            $options: "i",
          },
        }
      : {};

    const count = await WorkItem.countDocuments({ ...keyword });
    const workItems = await WorkItem.find({ ...keyword }).limit(pageSize);

    res.json({
      workItems,
      page: 1,
      pages: Math.ceil(count / pageSize),
      hasMore: false,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

const fetchWorkItemById = async (req: Request, res: Response) => {
  try {
    const workItem = await WorkItem.findById(req.params.id);
    if (workItem) {
      return res.json(workItem);
    } else {
      res.status(404);
      throw new Error("Không tìm thấy công việc");
    }
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: "Work item not found" });
  }
};

const addWorkItem = async (req: Request, res: Response) => {
  try {
    const { text, completed } = req.body;

    if (text === undefined) {
      return res.status(400).json({ error: "Phải có Text" });
    }
    const workItem = new WorkItem({
      text,
      completed,
    });
    await workItem.save();
    res.status(201).json(workItem);
  } catch (error) {
    console.error(error);
  }
};

const removeWorkItem = async (req: Request, res: Response) => {
  try {
    const workItem = await WorkItem.findByIdAndDelete(req.params.id);
    if (workItem) {
      res.json({ message: "Đã xoá công việc" });
    } else {
      res.status(404);
      throw new Error("Work item not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const updateWorkItemDetails = async (req: Request, res: Response) => {
  try {
    const { text, completed } = req.body;

    const workItem = await WorkItem.findByIdAndUpdate(
      req.params.id,
      {
        text,
        completed,
      },
      { new: true }
    );

    if (workItem) {
      await workItem.save();
      res.json(workItem);
    } else {
      res.status(404);
      throw new Error("Work item not found");
    }
  } catch (error) {
    console.error(error);
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
