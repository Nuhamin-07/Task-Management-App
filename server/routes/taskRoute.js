import { Router } from "express";
import {
  postTask,
  getTasks,
  getIndividualTask,
  updateIndividualTask,
  deleteIndividualTask,
} from "../controllers/taskController.js";

export const taskRouter = Router();

taskRouter.post("/tasks", postTask);
taskRouter.get("/tasks", getTasks);
taskRouter.get("/tasks/:id", getIndividualTask);
taskRouter.put("/tasks/:id", updateIndividualTask);
taskRouter.delete("/tasks/:id", deleteIndividualTask);
