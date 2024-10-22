import { createBrowserRouter } from "react-router-dom";
import "../styles/scrollbar.css";

// Internal dependencies
import Layout from "../layouts/Layout";
import PrivateRoute from "./PrivateRoute";
import { NotFound } from "../layouts/NotFound";
import { Login, Signup } from "../pages";

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
        element: <PrivateRoute roles={["user"]} />,
        children: [
          {
            path: "appointments",
            element: <>jsdjsdus</>,
          },
          {
            path: "users",
            element: <>jsdcaAFEAjsdus</>,
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
