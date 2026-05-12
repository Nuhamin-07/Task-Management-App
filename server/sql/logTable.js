import path from "node:path";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

async function insertTask() {
  const db = await open({
    filename: path.join("database.db"),
    driver: sqlite3.Database,
  });
  //   await db.run(
  //     `INSERT INTO tasks (name, description, priority, status, completed_at) VALUES (?, ?, ?, ?, ?)`,
  //     ["Excercise", "Go for a run for 20 minutes", "high", "todo", null],
  //   );

  const tasks = await db.all(`SELECT * FROM tasks`);

  console.table(tasks);
}

insertTask().catch((error) =>
  console.error("Error inserting task into database:", error),
);
