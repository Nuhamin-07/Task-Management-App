import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
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
  Search,
  Plus,
  CheckCircle2,
  Clock,
  ListTodo,
  AlertCircle,
  Eye,
  Pencil,
  Trash2,
  ArrowUpDown,
  FilterX,
  LayoutGrid,
  LayoutList,
  Check,
} from "lucide-react";

const API_BASE = "https://task-management-app-4-ina7.onrender.com/api";

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [searchTask, setSearchTask] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    async function fetchTasks() {
      if (!user) return;
      setIsLoading(true);
      try {
        const response = await fetch(`${API_BASE}/tasks`, {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }
        const data = await response.json();
        setTasks(Array.isArray(data) ? data : []);
      } catch (err) {
        toast.error(`Error fetching tasks: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    }
    fetchTasks();
  }, [user]);

  async function handleDelete(taskId) {
    try {
      const response = await fetch(`${API_BASE}/tasks/${taskId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await response.json();
      toast.success(data.message || "Task deleted successfully");
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (err) {
      toast.error(`Error deleting task: ${err.message}`);
    }
  }

  async function handleQuickStatusChange(taskToUpdate, newStatus) {
    try {
      const updatedData = {
        name: taskToUpdate.name,
        description: taskToUpdate.description,
        priority: taskToUpdate.priority,
        status: newStatus,
        completed_at: newStatus === "Completed" ? new Date().toISOString() : taskToUpdate.completed_at,
      };

      const response = await fetch(`${API_BASE}/tasks/${taskToUpdate.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      setTasks((prev) =>
        prev.map((t) => (t.id === taskToUpdate.id ? { ...t, ...updatedData } : t))
      );
      toast.success(`Task moved to ${newStatus === "Inprogress" ? "In Progress" : newStatus}`);
    } catch (err) {
      toast.error(`Failed to update task status: ${err.message}`);
    }
  }

  const metrics = useMemo(() => {
    const total = tasks.length;
    const todo = tasks.filter((t) => t.status === "Todo").length;
    const inProgress = tasks.filter((t) => t.status === "Inprogress").length;
    const completed = tasks.filter((t) => t.status === "Completed").length;
    return { total, todo, inProgress, completed };
  }, [tasks]);

  const filteredAndSortedTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        const matchesSearch =
          !searchTask ||
          task.name.toLowerCase().includes(searchTask.toLowerCase()) ||
          (task.description && task.description.toLowerCase().includes(searchTask.toLowerCase()));

        const matchesStatus =
          statusFilter === "all" || task.status === statusFilter;

        const matchesPriority =
          priorityFilter === "all" || task.priority === priorityFilter;

        return matchesSearch && matchesStatus && matchesPriority;
      })
      .sort((a, b) => {
        if (sortBy === "newest") {
          return (b.id || 0) - (a.id || 0);
        } else if (sortBy === "oldest") {
          return (a.id || 0) - (b.id || 0);
        } else if (sortBy === "priority") {
          const pOrder = { High: 3, Medium: 2, Low: 1 };
          return (pOrder[b.priority] || 0) - (pOrder[a.priority] || 0);
        } else if (sortBy === "title") {
          return a.name.localeCompare(b.name);
        }
        return 0;
      });
  }, [tasks, searchTask, statusFilter, priorityFilter, sortBy]);

  const hasActiveFilters = searchTask !== "" || statusFilter !== "all" || priorityFilter !== "all";

  function clearFilters() {
    setSearchTask("");
    setStatusFilter("all");
    setPriorityFilter("all");
    setSortBy("newest");
  }

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "High":
        return (
          <Badge className="bg-red-500/15 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800/50 font-medium">
            High Priority
          </Badge>
        );
      case "Medium":
        return (
          <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/50 font-medium">
            Medium Priority
          </Badge>
        );
      case "Low":
      default:
        return (
          <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/50 font-medium">
            Low Priority
          </Badge>
        );
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Completed":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
            <CheckCircle2 className="h-3 w-3" />
            Completed
          </span>
        );
      case "Inprogress":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">
            <Clock className="h-3 w-3" />
            In Progress
          </span>
        );
      case "Todo":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300">
            <ListTodo className="h-3 w-3" />
            To Do
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Task Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage, organize, and track your daily team assignments.
          </p>
        </div>
        <Button
          onClick={() => navigate("/task/new")}
          className="inline-flex items-center gap-2 shadow-xs shrink-0 font-medium"
        >
          <Plus className="h-4 w-4" />
          <span>Create New Task</span>
        </Button>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="bg-card/60 backdrop-blur border-border/80 shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Total Tasks
              </p>
              <h3 className="text-2xl font-bold mt-1 text-foreground">
                {metrics.total}
              </h3>
            </div>
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <ListTodo className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/60 backdrop-blur border-border/80 shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                To Do
              </p>
              <h3 className="text-2xl font-bold mt-1 text-foreground">
                {metrics.todo}
              </h3>
            </div>
            <div className="h-10 w-10 rounded-xl bg-slate-500/10 text-slate-600 dark:text-slate-400 flex items-center justify-center">
              <Clock className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/60 backdrop-blur border-border/80 shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                In Progress
              </p>
              <h3 className="text-2xl font-bold mt-1 text-blue-600 dark:text-blue-400">
                {metrics.inProgress}
              </h3>
            </div>
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Clock className="h-5 w-5 animate-spin-slow" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/60 backdrop-blur border-border/80 shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Completed
              </p>
              <h3 className="text-2xl font-bold mt-1 text-emerald-600 dark:text-emerald-400">
                {metrics.completed}
              </h3>
            </div>
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Control Bar */}
      <Card className="bg-card border-border/80 shadow-xs p-4 space-y-3">
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title or description..."
              value={searchTask}
              onChange={(e) => setSearchTask(e.target.value)}
              className="pl-9 pr-8"
            />
            {searchTask && (
              <button
                onClick={() => setSearchTask("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] text-xs h-9">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Todo">To Do</SelectItem>
                <SelectItem value="Inprogress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[140px] text-xs h-9">
                <SelectValue placeholder="All Priorities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px] text-xs h-9">
                <div className="flex items-center gap-1.5">
                  <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
                  <SelectValue placeholder="Sort by" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="title">Title</SelectItem>
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-9 px-2.5 text-xs text-muted-foreground hover:text-destructive"
              >
                <FilterX className="h-3.5 w-3.5 mr-1" />
                Reset
              </Button>
            )}

            <div className="hidden sm:flex border border-border rounded-lg p-0.5 bg-muted/40">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setViewMode("grid")}
                className="h-8 w-8 rounded"
                title="Grid view"
              >
                <LayoutGrid className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setViewMode("list")}
                className="h-8 w-8 rounded"
                title="List view"
              >
                <LayoutList className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Task Content Section */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <Card key={n} className="p-5 animate-pulse space-y-4">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-full"></div>
              <div className="h-3 bg-muted rounded w-2/3"></div>
              <div className="flex justify-between items-center pt-2">
                <div className="h-5 bg-muted rounded w-1/3"></div>
                <div className="h-8 bg-muted rounded w-1/4"></div>
              </div>
            </Card>
          ))}
        </div>
      ) : filteredAndSortedTasks.length === 0 ? (
        <Card className="p-12 text-center border-dashed border-2 bg-card/50">
          <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-4">
              <AlertCircle className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">
              {hasActiveFilters ? "No matching tasks" : "No tasks created yet"}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 mb-6">
              {hasActiveFilters
                ? "Try adjusting your search keywords or filter criteria."
                : "Get started by creating your first task assignment."}
            </p>
            {hasActiveFilters ? (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Clear All Filters
              </Button>
            ) : (
              <Button size="sm" onClick={() => navigate("/task/new")}>
                <Plus className="h-4 w-4 mr-1.5" />
                Create First Task
              </Button>
            )}
          </div>
        </Card>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAndSortedTasks.map((task) => (
            <Card
              key={task.id}
              className="flex flex-col justify-between hover:shadow-md transition-all duration-200 border-border/80 group"
            >
              <CardHeader className="p-4 pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    {getStatusBadge(task.status)}
                    <CardTitle className="text-base font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                      {task.name}
                    </CardTitle>
                  </div>
                  {getPriorityBadge(task.priority)}
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-2 flex-1 flex flex-col justify-between space-y-4">
                <CardDescription className="text-xs text-muted-foreground line-clamp-2 min-h-[32px]">
                  {task.description || "No description provided."}
                </CardDescription>

                <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    {task.status !== "Completed" && (
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() =>
                          handleQuickStatusChange(
                            task,
                            task.status === "Todo" ? "Inprogress" : "Completed"
                          )
                        }
                        className="h-7 px-2 text-xs text-muted-foreground hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50"
                        title={task.status === "Todo" ? "Mark In Progress" : "Mark Complete"}
                      >
                        <Check className="h-3 w-3 mr-1" />
                        {task.status === "Todo" ? "Start" : "Done"}
                      </Button>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigate(`/task/${task.id}`)}
                      className="h-7 w-7 text-muted-foreground hover:text-foreground"
                      title="View Details"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigate(`/task/${task.id}/edit`)}
                      className="h-7 w-7 text-muted-foreground hover:text-foreground"
                      title="Edit Task"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive"
                          title="Delete Task"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Task</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{task.name}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(task.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="divide-y divide-border overflow-hidden">
          {filteredAndSortedTasks.map((task) => (
            <div
              key={task.id}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/40 transition-colors"
            >
              <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                <div className="mt-0.5 sm:mt-0">
                  {getStatusBadge(task.status)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4
                      onClick={() => navigate(`/task/${task.id}`)}
                      className="text-sm font-semibold text-foreground truncate cursor-pointer hover:underline"
                    >
                      {task.name}
                    </h4>
                    {getPriorityBadge(task.priority)}
                  </div>
                  {task.description && (
                    <p className="text-xs text-muted-foreground truncate mt-0.5 max-w-xl">
                      {task.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-border">
                {task.status !== "Completed" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleQuickStatusChange(
                        task,
                        task.status === "Todo" ? "Inprogress" : "Completed"
                      )
                    }
                    className="h-8 text-xs"
                  >
                    <Check className="h-3 w-3 mr-1" />
                    {task.status === "Todo" ? "Start" : "Complete"}
                  </Button>
                )}
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(`/task/${task.id}`)}
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    title="View Task"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(`/task/${task.id}/edit`)}
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    title="Edit Task"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        title="Delete Task"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Task</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{task.name}"?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(task.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
