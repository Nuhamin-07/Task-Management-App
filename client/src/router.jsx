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
        path: "/task/new",
        element: <CreateTask />,
      },
      {
        path: "/task/:id",
        element: <CreateTask />,
      },
      {
        path: "/task/:id/edit",
        element: <CreateTask />,
      },
    ],
  },
]);

export default router;
