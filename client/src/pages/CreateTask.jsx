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
import { useState } from "react";

export default function CreateTask() {
  const [task, setTask] = useState({
    name: "",
    description: "",
    priority: "",
    status: "",
    completed_at: "",
  });

  async function handleSubmit(e) {
    e.preventDefault();

    const taskData = {
      name: task.name,
      description: task.description,
      priority: task.priority,
      status: task.status,
      completed_at: task.completed_at,
    };

    await fetch("http://localhost:3000/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskData),
    });
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <label htmlFor="task-name">Task Name</label>
      <Input
        type="text"
        id="task-name"
        name="task-name"
        placeholder="Task Name"
        required
        value={task.name}
        onChange={(e) => setTask({ ...task, name: e.target.value })}
      />
      <label htmlFor="task-desc">Description</label>
      <Textarea
        id="task-desc"
        name="task-desc"
        placeholder="Task Description"
        value={task.description}
        onChange={(e) => setTask({ ...task, description: e.target.value })}
      />
      <label htmlFor="task-priority">Task Priority</label>
      <Select
        id="task-priority"
        name="task-priority"
        required
        value={task.priority}
        onValueChange={(value) => setTask({ ...task, priority: value })}
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
      <label htmlFor="task-status">Status</label>
      <Select
        id="task-status"
        name="task-status"
        required
        value={task.status}
        onValueChange={(value) => setTask({ ...task, status: value })}
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
      <label htmlFor="task-completed-at">Completed At</label>
      <Input
        type="datetime-local"
        id="task-completed-at"
        name="task-completed-at"
        value={task.completed_at}
        onChange={(e) => setTask({ ...task, completed_at: e.target.value })}
      />
      <Button type="submit">Create Task</Button>
    </form>
  );
}
