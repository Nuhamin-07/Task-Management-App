import { createBrowserRouter } from "react-router-dom";
import TaskList from "./pages/TaskList";
import MainLayout from "./components/MainLayout";
import CreateTask from "./pages/CreateTask";
import Signup from "./pages/Signup";

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
      {
        path: "/signup",
        element: <Signup />,
      },
    ],
  },
]);

export default router;
