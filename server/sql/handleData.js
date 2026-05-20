import path from "node:path";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

const db = await open({
  filename: path.join("database.db"),
  driver: sqlite3.Database,
});

// export async function dropTable() {
//   await db.exec(`DROP TABLE IF EXISTS tasks`);
// }

export async function createDatabaseTable() {
  // await db.exec(`CREATE TABLE IF NOT EXISTS tasks(
  //     id INTEGER PRIMARY KEY AUTOINCREMENT,
  //     name TEXT NOT NULL,
  //     description TEXT,
  //     priority TEXT CHECK (
  //         priority IN ('Low', 'Medium', 'High')
  //     ) NOT NULL,
  //     created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  //     status TEXT CHECK (
  //         status IN ('Todo', 'Inprogress', 'Completed')
  //     ) NOT NULL DEFAULT 'todo',
  //     completed_at DATETIME
  //     )`);

  const table = await db.all(`PRAGMA table_info(tasks)`);
  console.log(table);
}

export async function insertTask(
  name,
  description,
  priority,
  status,
  completed_at,
) {
  await db.run(
    `INSERT INTO tasks (name, description, priority, status, completed_at) VALUES (?, ?, ?, ?, ?)`,
    [name, description, priority, status, completed_at],
  );
}

export async function getAllTasks() {
  const tasks = await db.all(`SELECT * FROM tasks ORDER BY created_at DESC`);
  return tasks;
}

export async function getTaskById(id) {
  const task = await db.get(`SELECT * FROM tasks WHERE id = ?`, [id]);
  return task;
}

export async function updateTask(
  id,
  name,
  description,
  priority,
  status,
  completed_at,
) {
  await db.run(
    `UPDATE tasks SET name = ?, description = ?, priority = ?, status = ?, completed_at = ? WHERE id = ?`,
    [name, description, priority, status, completed_at, id],
  );
}

export async function deleteTask(id) {
  await db.run(`DELETE FROM tasks WHERE id = ?`, [id]);
}
