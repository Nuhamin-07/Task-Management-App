import { createBrowserRouter } from "react-router-dom";
import TaskList from "./pages/TaskList";
import MainLayout from "./components/MainLayout";
import CreateTask from "./pages/CreateTask";
import Signup from "./pages/Signup";
import Login from "./pages/Login";

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
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
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <Login />,
  },
]);

export default router;
