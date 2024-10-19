import { createBrowserRouter } from "react-router-dom";
import "../styles/scrollbar.css";

// Internal dependencies
import Layout from "../layouts/Layout";
import PrivateRoute from "./PrivateRoute";
import { NotFound } from "../layouts/NotFound";
import Authentication from "../pages/Authentication";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Authentication />,
      },

      {
        path: "/user",
        element: <PrivateRoute roles={["user"]} />,
        children: [
          {
            path: "dashboard",
            element: <>jsdjsdus</>,
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
