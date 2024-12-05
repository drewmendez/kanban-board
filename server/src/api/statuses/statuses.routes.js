import express from "express";
import { verifyAuthCookie } from "../../middlewares/verifyAuthCookie.js";
import { handleGetStatuses } from "./statuses.handlers.js";

export const router = express.Router();

router.get("/", verifyAuthCookie, handleGetStatuses);
