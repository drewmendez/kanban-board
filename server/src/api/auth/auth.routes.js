import express from "express";
import { handleSignIn, handleSignUp } from "./auth.handlers.js";

export const router = express.Router();

router.post("/sign-in", handleSignIn);
router.post("/sign-up", handleSignUp);
