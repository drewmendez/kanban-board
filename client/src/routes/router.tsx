import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import SignUpPage from "../pages/SignUpPage";
import SignInPage from "../pages/SignInPage";
import TasksPage from "../pages/TasksPage";
import ProtectedRoute from "./ProtectedRoute";
import AddTask from "../pages/AddTask";
import UptadeTask from "../pages/UptadeTask";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/sign-up",
    element: <SignUpPage />,
  },
  {
    path: "/sign-in",
    element: <SignInPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/tasks",
        element: <TasksPage />,
      },
      {
        path: "/tasks/add-task",
        element: <AddTask />,
      },
      {
        path: "/tasks/update-task/:task_id",
        element: <UptadeTask />,
      },
    ],
  },
]);

export default router;
