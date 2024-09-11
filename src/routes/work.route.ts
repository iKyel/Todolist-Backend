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
  fetchWorkItemsByUser,
} from "../controllers/work.controller";
import multer from "multer";

const workRouter = express.Router();

// uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); 
  },
});

const upload = multer({ storage });

workRouter.route("/:id").get(verifyToken, fetchWorkItemById);
workRouter.route("/add").post(verifyToken, upload.single("image"), addWorkItem);
workRouter.route("/:id").delete(verifyToken, removeWorkItem);
workRouter.route("/:id").put(verifyToken, upload.single("image"), updateWorkItemDetails);
workRouter.route("/").get(verifyToken, fetchWorkItemsByUser);
export default workRouter;
