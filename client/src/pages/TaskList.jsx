import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAuth } from "../context/AuthContext";

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [searchTask, setSearchTask] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    async function fetchTasks() {
      if (!user) return;
      const response = await fetch("http://localhost:3000/api/tasks", {
        credentials: "include",
      });
      const tasks = await response.json();
      setTasks(tasks);
    }
    fetchTasks();
  }, []);

  async function handleDelete(taskId) {
    try {
      const response = await fetch(
        `http://localhost:3000/api/tasks/${taskId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );
      const data = await response.json();
      console.log("Task deleted: ", data);
      setTasks(tasks.filter((task) => task.id !== taskId));
    } catch (err) {
      console.log("Error deleting task: ", err);
    }
  }

  const filteredTasks =
    tasks && searchTask
      ? tasks.filter((task) =>
          task.name.toLowerCase().includes(searchTask.toLowerCase()),
        )
      : tasks
        ? tasks
        : null;

  return (
    <div className="space-y-4 container list-container">
      <h2>My Tasks</h2>
      <div className="flex items-center gap-10 list-header-container">
        <Input
          placeholder="Search tasks..."
          value={searchTask}
          onChange={(e) => setSearchTask(e.target.value)}
        />
        <Button
          onClick={() => navigate("/task/new")}
          className="create-task-button"
        >
          Create New Task
        </Button>
      </div>

      {filteredTasks ? (
        filteredTasks.map((task) => (
          <div key={task.id} className="border rounded-lg p-4 task-container">
            <div>
              <h3 className="font-semibold">{task.name}</h3>
              <p>{task.description}</p>
              <p className="text-sm text-muted-foreground">{task.status}</p>
              <div className="button-container">
                <Button onClick={() => navigate(`/task/${task.id}`)}>
                  View
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate(`/task/${task.id}/edit`)}
                >
                  Edit
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">Delete</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your task from the list.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(task.id)}>
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
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
        ))
      ) : (
        <h3>No tasks found</h3>
      )}
    </div>
  );
}
