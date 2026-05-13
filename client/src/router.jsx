import { createBrowserRouter } from "react-router-dom";
import TaskList from "./pages/TaskList";
import MainLayout from "./components/MainLayout";

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
        element: <h1>New Task Page</h1>,
      },
    ],
  },
]);

export default router;
