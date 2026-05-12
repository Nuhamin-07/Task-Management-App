import {
  insertTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from "../sql/handleData.js";

export async function postTask(req, res) {
  const { name, description, priority, status, completed_at } = req.body;

  await insertTask(name, description, priority, status, completed_at);

  res.status(201).json({ message: "Task created successfully" });
}
