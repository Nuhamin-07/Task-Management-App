import { Router } from "express";
import { postTask } from "../controllers/taskController.js";

export const taskRouter = Router();

taskRouter.post("/tasks", postTask);
