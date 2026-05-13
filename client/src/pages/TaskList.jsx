import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
            <p className="text-sm text-muted-foreground">{task.status}</p>
            <div className="button-container">
              <Button variant="outline">Edit</Button>
              <Button variant="destructive">Delete</Button>
            </div>
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
