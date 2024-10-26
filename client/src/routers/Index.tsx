import { createBrowserRouter, Outlet } from "react-router-dom";
import "../styles/scrollbar.css";

// Internal dependencies
import PrivateRoute from "./PrivateRoute";
import { NotFound } from "../layouts/NotFound";
import { Appointment, Login, Signup, Users } from "../pages";
import ProtectedRoute from "./ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Outlet />,
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "/",
            element: <Login />,
          },
          {
            path: "/sign-up",
            element: <Signup />,
          },
        ],
      },

      {
        path: "/",
        element: <PrivateRoute />,
        children: [
          {
            path: "appointments",
            element: <Appointment />,
          },
          {
            path: "users",
            element: <Users />,
          },
        ],
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

export default router;
