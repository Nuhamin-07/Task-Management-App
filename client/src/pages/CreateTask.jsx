import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  ListTodo,
  Pencil,
  Trash2,
  Loader2,
  FileText,
  Tag,
  Activity,
  Check,
} from "lucide-react";

const API_BASE = "https://task-management-app-4-ina7.onrender.com/api";

export default function CreateTask() {
  const [task, setTask] = useState({
    name: "",
    description: "",
    priority: "Medium",
    status: "Todo",
    completed_at: "",
    user_id: "",
  });

  const [isLoadingTask, setIsLoadingTask] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { user } = useAuth();

  const isEditMode = location.pathname.includes("/edit");
  const isViewMode = Boolean(id && !isEditMode);

  useEffect(() => {
    async function fetchTask() {
      if (!id) return;
      setIsLoadingTask(true);
      try {
        const response = await fetch(`${API_BASE}/tasks/${id}`, {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Task not found");
        }
        const taskData = await response.json();
        setTask({
          name: taskData.name || "",
          description: taskData.description || "",
          priority: taskData.priority || "Medium",
          status: taskData.status || "Todo",
          completed_at: taskData.completed_at || "",
          user_id: taskData.user_id || "",
        });
      } catch (error) {
        toast.error(`Error fetching task: ${error.message}`);
        navigate("/tasks");
      } finally {
        setIsLoadingTask(false);
      }
    }

    fetchTask();
  }, [id, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!task.name.trim()) {
      toast.error("Task name is required");
      return;
    }

    try {
      setIsSubmitting(true);

      const taskData = {
        name: task.name,
        description: task.description,
        priority: task.priority,
        status: task.status,
        completed_at: task.status === "Completed" && !task.completed_at
          ? new Date().toISOString()
          : task.completed_at,
        user_id: user?.id,
      };

      const url = id ? `${API_BASE}/tasks/${id}` : `${API_BASE}/tasks`;
      const method = id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(taskData),
      });

      const data = await response.json();

      if (response.ok) {
        const action = id ? "updated" : "created";
        toast.success(`Task ${action} successfully`);
        navigate("/tasks");
      } else {
        toast.error(data.error || `Error processing task`);
      }
    } catch (err) {
      toast.error(`Error saving task: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    try {
      const response = await fetch(`${API_BASE}/tasks/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await response.json();
      toast.success(data.message || "Task deleted successfully");
      navigate("/tasks");
    } catch (err) {
      toast.error(`Error deleting task: ${err.message}`);
    }
  }

  async function handleQuickStatusUpdate(newStatus) {
    try {
      const updatedData = {
        ...task,
        status: newStatus,
        completed_at: newStatus === "Completed" ? new Date().toISOString() : task.completed_at,
      };

      const response = await fetch(`${API_BASE}/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        setTask(updatedData);
        toast.success(`Task marked as ${newStatus === "Inprogress" ? "In Progress" : newStatus}`);
      }
    } catch (err) {
      toast.error(`Failed to update status: ${err.message}`);
    }
  }

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "High":
        return <Badge className="bg-red-500/15 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800">High Priority</Badge>;
      case "Medium":
        return <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800">Medium Priority</Badge>;
      case "Low":
      default:
        return <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800">Low Priority</Badge>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Completed":
        return (
          <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> Completed
          </Badge>
        );
      case "Inprogress":
        return (
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-300 flex items-center gap-1">
            <Clock className="h-3 w-3" /> In Progress
          </Badge>
        );
      case "Todo":
      default:
        return (
          <Badge className="bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-300 flex items-center gap-1">
            <ListTodo className="h-3 w-3" /> To Do
          </Badge>
        );
    }
  };

  if (isLoadingTask) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading task details...</p>
      </div>
    );
  }

  if (isViewMode) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/tasks")}
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Tasks
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/task/${id}/edit`)}
              className="flex items-center gap-1.5"
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  className="flex items-center gap-1.5"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Task</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this task? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete Task
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <Card className="border-border/80 shadow-xs overflow-hidden">
          <CardHeader className="p-6 border-b border-border/60 bg-muted/20 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {getStatusBadge(task.status)}
                {getPriorityBadge(task.priority)}
              </div>
              <span className="text-xs text-muted-foreground">Task #{id}</span>
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">
              {task.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5" />
                Description
              </h4>
              <div className="p-4 rounded-lg bg-muted/40 text-sm text-foreground leading-relaxed whitespace-pre-wrap min-h-[100px]">
                {task.description || "No description provided for this task."}
              </div>
            </div>

            <div className="p-4 rounded-xl border border-border bg-card flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5 text-primary" />
                Quick Status Workflow:
              </span>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                {task.status !== "Todo" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickStatusUpdate("Todo")}
                    className="text-xs flex-1 sm:flex-initial"
                  >
                    Move to To Do
                  </Button>
                )}
                {task.status !== "Inprogress" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickStatusUpdate("Inprogress")}
                    className="text-xs flex-1 sm:flex-initial"
                  >
                    Move to In Progress
                  </Button>
                )}
                {task.status !== "Completed" && (
                  <Button
                    size="sm"
                    onClick={() => handleQuickStatusUpdate("Completed")}
                    className="text-xs flex-1 sm:flex-initial bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    <Check className="h-3.5 w-3.5 mr-1" />
                    Mark as Completed
                  </Button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-3 rounded-lg border border-border/60 bg-card space-y-1">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Tag className="h-3.5 w-3.5" /> Priority Level
                </span>
                <p className="text-sm font-semibold text-foreground">{task.priority}</p>
              </div>
              <div className="p-3 rounded-lg border border-border/60 bg-card space-y-1">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" /> Completion Timestamp
                </span>
                <p className="text-sm font-semibold text-foreground">
                  {task.completed_at ? new Date(task.completed_at).toLocaleString() : "Not completed yet"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/tasks")}
          className="h-9 w-9 rounded-lg"
          title="Back to tasks"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {isEditMode ? "Edit Task" : "Create New Task"}
          </h1>
          <p className="text-xs text-muted-foreground">
            {isEditMode
              ? "Update task details, status, or priority level."
              : "Add a new task assignment to your workspace."}
          </p>
        </div>
      </div>

      <Card className="border-border/80 shadow-xs">
        <CardContent className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="task-name" className="text-sm font-medium text-foreground flex items-center gap-1">
                Task Name <span className="text-destructive">*</span>
              </label>
              <Input
                id="task-name"
                name="task-name"
                placeholder="e.g. Redesign User Profile Dashboard"
                value={task.name}
                onChange={(e) => setTask({ ...task, name: e.target.value })}
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="task-desc" className="text-sm font-medium text-foreground">
                Description
              </label>
              <Textarea
                id="task-desc"
                name="task-desc"
                placeholder="Provide task instructions, requirements, or scope details..."
                value={task.description}
                onChange={(e) => setTask({ ...task, description: e.target.value })}
                rows={4}
                className="w-full resize-y"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="task-priority" className="text-sm font-medium text-foreground">
                  Priority Level <span className="text-destructive">*</span>
                </label>
                <Select
                  value={task.priority}
                  onValueChange={(val) => setTask({ ...task, priority: val })}
                >
                  <SelectTrigger id="task-priority" className="w-full">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Priority</SelectLabel>
                      <SelectItem value="Low">Low Priority</SelectItem>
                      <SelectItem value="Medium">Medium Priority</SelectItem>
                      <SelectItem value="High">High Priority</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="task-status" className="text-sm font-medium text-foreground">
                  Current Status <span className="text-destructive">*</span>
                </label>
                <Select
                  value={task.status}
                  onValueChange={(val) => setTask({ ...task, status: val })}
                >
                  <SelectTrigger id="task-status" className="w-full">
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

            <div className="space-y-2">
              <label htmlFor="task-completed-at" className="text-sm font-medium text-foreground">
                Completion Timestamp (Optional)
              </label>
              <Input
                type="datetime-local"
                id="task-completed-at"
                name="task-completed-at"
                value={task.completed_at ? task.completed_at.slice(0, 16) : ""}
                onChange={(e) => setTask({ ...task, completed_at: e.target.value })}
                className="w-full"
              />
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/tasks")}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </span>
                ) : isEditMode ? (
                  "Update Task"
                ) : (
                  "Create Task"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
