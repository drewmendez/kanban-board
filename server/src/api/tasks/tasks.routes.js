import express from "express";
import {
  handleCreateTask,
  handleDeleteTask,
  handleGetTasks,
  handleGetTask,
  handleUpdateTask,
  handleUpdateTaskStatusAndReorder,
} from "./tasks.handlers.js";
import { verifyAuthCookie } from "../../middlewares/verifyAuthCookie.js";

export const router = express.Router();

router.get("/", verifyAuthCookie, handleGetTasks);
router.get("/:task_id", verifyAuthCookie, handleGetTask);
router.post("/", verifyAuthCookie, handleCreateTask);
router.put("/:task_id", verifyAuthCookie, handleUpdateTask);
router.patch("/:task_id", verifyAuthCookie, handleUpdateTaskStatusAndReorder);
router.delete("/:task_id/:status_id", verifyAuthCookie, handleDeleteTask);
