import { Router } from "express";
import {
  postTask,
  getTasks,
  getIndividualTask,
  updateIndividualTask,
  deleteIndividualTask,
} from "../controllers/taskController.js";
import { requireAuth } from "../controllers/authController.js";

export const taskRouter = Router();

taskRouter.post("/tasks", requireAuth, postTask);
taskRouter.get("/tasks", requireAuth, getTasks);
taskRouter.get("/tasks/:id", requireAuth, getIndividualTask);
taskRouter.put("/tasks/:id", requireAuth, updateIndividualTask);
taskRouter.delete("/tasks/:id", requireAuth, deleteIndividualTask);
