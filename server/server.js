import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";

import { router as authRoute } from "./src/api/auth/auth.routes.js";
import { router as tasksRoute } from "./src/api/tasks/tasks.routes.js";
import { router as statusesRoute } from "./src/api/statuses/statuses.routes.js";

// initializations
const app = express();

// middlewares
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173", // Frontend URL
    credentials: true,
  })
);
app.use(express.json());

// API routes
app.use("/auth", authRoute);
app.use("/tasks", tasksRoute);
app.use("/statuses", statusesRoute);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
