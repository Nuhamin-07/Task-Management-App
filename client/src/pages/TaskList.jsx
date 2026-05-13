import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";

export default function TaskList() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    async function fetchTasks() {
      const response = await fetch("http://localhost:3000/api/tasks");
      const tasks = await response.json();
      setTasks(tasks);
    }
    fetchTasks();
  }, []);

  console.log(tasks);
  return (
    <div className="space-y-4 container">
      {tasks?.map((task) => (
        <div key={task.id} className="border rounded-lg p-4 task-container">
          <div>
            <h3 className="font-semibold">{task.name}</h3>
            <p>{task.description}</p>
            <p>
              <strong className="text-sm text-muted-foreground">
                {task.status}
              </strong>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              className={
                task.priority === "High"
                  ? "bg-red-50 text-red-700"
                  : task.priority === "Medium"
                    ? "bg-yellow-50 text-yellow-700"
                    : "bg-green-50 text-green-700"
              }
            >
              {task.priority}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
}
