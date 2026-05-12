import path from "node:path";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

async function createDatabaseTable() {
  const db = await open({
    filename: path.join("database.db"),
    driver: sqlite3.Database,
  });

  //   await db.exec(`CREATE TABLE IF NOT EXISTS tasks(
  //     id INTEGER PRIMARY KEY AUTOINCREMENT,
  //     name TEXT NOT NULL,
  //     description TEXT,
  //     priority TEXT CHECK (
  //         priority IN ('low', 'medium', 'high')
  //     ) NOT NULL,
  //     created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  //     status TEXT CHECK (
  //         status IN ('todo', 'inprogress', 'completed')
  //     ) NOT NULL DEFAULT 'todo',
  //     completed_at DATETIME
  //     )`);

  const table = await db.all(`PRAGMA table_info(tasks)`);
  console.log(table);
}

createDatabaseTable().catch((error) =>
  console.error("Error creating database table:", error),
);
