import { createBrowserRouter } from "react-router-dom";
import "../styles/scrollbar.css";

// Internal dependencies
import Layout from "../layouts/Layout";
import PrivateRoute from "./PrivateRoute";
import { NotFound } from "../layouts/NotFound";
import { Appointment, Login, Signup, Users } from "../pages";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Login />,
      },
      {
        path: "/sign-up",
        element: <Signup />,
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
