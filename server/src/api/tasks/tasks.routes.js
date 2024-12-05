import express from "express";
import {
  handleCreateTask,
  handleDeleteTask,
  handleGetAllTasks,
  handleGetTask,
  handleGetTasksByStatus,
  handleUpdateTask,
  handleUpdateTaskStatusAndReorder,
} from "./tasks.handlers.js";
import { verifyAuthCookie } from "../../middlewares/verifyAuthCookie.js";

export const router = express.Router();

router.get("/all", verifyAuthCookie, handleGetAllTasks);
router.get("/", verifyAuthCookie, handleGetTasksByStatus);
router.get("/:task_id", verifyAuthCookie, handleGetTask);
router.post("/", verifyAuthCookie, handleCreateTask);
router.put("/:task_id", verifyAuthCookie, handleUpdateTask);
router.patch("/:task_id", handleUpdateTaskStatusAndReorder);
router.delete("/:task_id/:status_id", verifyAuthCookie, handleDeleteTask);
