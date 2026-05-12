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

export async function getTasks(req, res) {
  const tasks = await getAllTasks();
  res.json(tasks);
}

export async function getIndividualTask(req, res) {
  const { id } = req.params;
  const task = await getTaskById(id);
  res.json(task);
}

export async function updateIndividualTask(req, res) {
  const { id } = req.params;
  const { name, description, priority, status, completed_at } = req.body;
  await updateTask(id, name, description, priority, status, completed_at);
  res.json({ message: "Task updated successfully" });
}

export async function deleteIndividualTask(req, res) {
  const { id } = req.params;
  await deleteTask(id);
  res.json({ message: "Task deleted successfully" });
}
