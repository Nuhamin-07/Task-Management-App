import { createBrowserRouter } from "react-router-dom";
import Header from "./components/Header";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Header />,
  },
  {
    path: "/tasks",
    element: <h1>Tasks Page</h1>,
  },
  {
    path: "/task-form",
    element: <h1>New Task Page</h1>,
  },
]);

export default router;
