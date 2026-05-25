import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useParams, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

export default function CreateTask() {
  const [task, setTask] = useState({
    name: "",
    description: "",
    priority: "",
    status: "",
    completed_at: "",
    user_id: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { user } = useAuth();

  const isEditMode = location.pathname.includes("/edit");
  const isViewMode = id && !isEditMode;

  useEffect(() => {
    async function fetchTask() {
      if (!id) return;
      try {
        const response = await fetch(`http://localhost:3000/api/tasks/${id}`, {
          credentials: "include",
        });
        const taskData = await response.json();
        setTask({
          name: taskData.name || "",
          description: taskData.description || "",
          priority: taskData.priority || "",
          status: taskData.status || "",
          completed_at: taskData.completed_at || "",
          user_id: taskData.user_id || "",
        });
      } catch (error) {
        toast.error(`Error fetching task: ${error.message}`);
      }
    }

    fetchTask();
  }, [id]);

  async function handleSubmit(e) {
    try {
      e.preventDefault();

      setIsSubmitting(true);

      const taskData = {
        name: task.name,
        description: task.description,
        priority: task.priority,
        status: task.status,
        completed_at: task.completed_at,
        user_id: user.id,
      };

      const url = id
        ? `http://localhost:3000/api/tasks/${id}`
        : "http://localhost:3000/api/tasks";
      const method = id ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(taskData),
      });
      const data = await response.json();
      const action = id ? "updated" : "created";
      if (response.ok) {
        toast.success(`Task ${action} successfully`);
      } else {
        toast.error(data.error || `Error ${action} task`);
      }
      setTask({
        name: "",
        description: "",
        priority: "",
        status: "",
        completed_at: "",
        user_id: user.id,
      });
      navigate("/tasks");
    } catch (err) {
      toast.error(`Error creating/updating task: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <div className="form-container">
      <Button className="back-button" onClick={() => navigate("/tasks")}>
        <ArrowLeft />
      </Button>
      <h2>
        {isViewMode
          ? "Task Details"
          : isEditMode
            ? "Edit Task"
            : "Create New Task"}
      </h2>
      <form
        className="task-form"
        onSubmit={handleSubmit}
        disabled={isViewMode || isSubmitting}
      >
        <label htmlFor="task-name">Task Name</label>
        <Input
          type="text"
          id="task-name"
          name="task-name"
          placeholder="Task Name"
          required
          value={task.name}
          onChange={(e) => setTask({ ...task, name: e.target.value })}
          disabled={isViewMode}
        />
        <label htmlFor="task-desc">Description</label>
        <Textarea
          id="task-desc"
          name="task-desc"
          placeholder="Task Description"
          value={task.description}
          onChange={(e) => setTask({ ...task, description: e.target.value })}
          disabled={isViewMode}
        />
        <div className="select-input-container">
          <div>
            <label htmlFor="task-priority">Task Priority</label>
            <Select
              id="task-priority"
              name="task-priority"
              required
              value={task.priority}
              onValueChange={(value) => setTask({ ...task, priority: value })}
              disabled={isViewMode}
            >
              <SelectTrigger className="w-full max-w-48">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Priority</SelectLabel>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="task-status">Status</label>
            <Select
              id="task-status"
              name="task-status"
              required
              value={task.status}
              onValueChange={(value) => setTask({ ...task, status: value })}
              disabled={isViewMode}
            >
              <SelectTrigger className="w-full max-w-48">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Status</SelectLabel>
                  <SelectItem value="Todo">To Do</SelectItem>
                  <SelectItem value="Inprogress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <label htmlFor="task-completed-at">Completed At</label>
        <Input
          type="datetime-local"
          id="task-completed-at"
          name="task-completed-at"
          value={task.completed_at}
          onChange={(e) => setTask({ ...task, completed_at: e.target.value })}
          disabled={isViewMode}
        />
        {!isViewMode && (
          <Button disabled={isSubmitting} type="submit">
            {isSubmitting
              ? id
                ? "Updating..."
                : "Saving..."
              : id
                ? "Update Task"
                : "Create Task"}
          </Button>
        )}
      </form>
    </div>
  );
}
