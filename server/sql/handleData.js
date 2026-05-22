import path from "node:path";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

const db = await open({
  filename: path.join("database.db"),
  driver: sqlite3.Database,
});

// export async function dropTable() {
//   await db.exec(`DROP TABLE IF EXISTS users`);
// }

// export async function createDatabaseTable() {
//   await db.exec(`CREATE TABLE IF NOT EXISTS tasks(
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       name TEXT NOT NULL,
//       description TEXT,
//       priority TEXT CHECK (
//           priority IN ('Low', 'Medium', 'High')
//       ) NOT NULL,
//       created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//       status TEXT CHECK (
//           status IN ('Todo', 'Inprogress', 'Completed')
//       ) NOT NULL DEFAULT 'todo',
//       completed_at DATETIME
//       )`);

//   const table = await db.all(`PRAGMA table_info(tasks)`);
//   console.log(table);
// }

// export async function createUserTable() {
//   await db.exec(`CREATE TABLE IF NOT EXISTS users(
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     first_name TEXT NOT NULL,
//     last_name TEXT NOT NULL,
//     email TEXT NOT NULL UNIQUE,
//     password TEXT NOT NULL,
//     created_at DATETIME DEFAULT CURRENT_TIMESTAMP
//   )`);

//   const table = await db.all(`SELECT * FROM users`);
//   console.log(table);
// }

// export async function alterTaskTable() {
//   await db.exec(`ALTER TABLE tasks
// ADD COLUMN user_id INTEGER REFERENCES users(id);`);

//   console.table(await db.all(`SELECT * FROM tasks`));
// }

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
  console.log(tasks);
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

export async function insertUser(first_name, last_name, email, password) {
  const newUser = await db.run(
    `INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)`,
    [first_name, last_name, email, password],
  );
  return newUser;
}

export async function getUserByEmail(email) {
  const user = await db.get(`SELECT * FROM users WHERE email = ?`, [email]);
  return user;
}

export async function getCurrentUserById(id) {
  const user = await db.get(`SELECT * FROM users WHERE id = ?`, [id]);
  return user;
}
