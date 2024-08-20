import express from "express";

// controller
import {
  fetchWorkItemById,
  fetchWorkItems,
  addWorkItem,
  removeWorkItem,
  updateWorkItemDetails,
  fetchCompletedWorkItems,
  fetchIncompleteWorkItems,
} from "../controllers/work.controller";

const workRouter = express.Router();

workRouter.route("/").get(fetchWorkItems);
workRouter.route("/:id").get(fetchWorkItemById);
workRouter.route("/").post(addWorkItem)
workRouter.route("/:id").delete(removeWorkItem)
workRouter.route("/:id").put(updateWorkItemDetails);
workRouter.route("/completed").get(fetchCompletedWorkItems);
workRouter.route("/incomplete").get(fetchIncompleteWorkItems);

export default workRouter;
