import express from "express";

// middleware
import { verifyToken } from "../middlewares/verifyToken.middleware";

// controller
import {
  fetchWorkItemById,
  fetchWorkItems,
  addWorkItem,
  removeWorkItem,
  updateWorkItemDetails,
} from "../controllers/work.controller";

const workRouter = express.Router();

workRouter.route("/").get(verifyToken, fetchWorkItems);
workRouter.route("/:id").get(verifyToken, fetchWorkItemById);
workRouter.route("/").post(verifyToken, addWorkItem)
workRouter.route("/:id").delete(verifyToken, removeWorkItem)
workRouter.route("/:id").put(verifyToken, updateWorkItemDetails);
export default workRouter;
