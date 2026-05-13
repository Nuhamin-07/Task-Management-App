import { createBrowserRouter } from "react-router-dom";
import TaskList from "./pages/TaskList";
import MainLayout from "./components/MainLayout";
import CreateTask from "./pages/CreateTask";

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <TaskList />,
      },
      {
        path: "/tasks",
        element: <TaskList />,
      },
      {
        path: "/task-form",
        element: <CreateTask />,
      },
    ],
  },
]);

export default router;
