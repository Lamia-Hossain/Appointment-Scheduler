import { Outlet, Navigate } from "react-router-dom";
import { isLogin } from "../utils/tokenHelper";

// Protects routes by checking if the user is logged in
const ProtectedRoute = () => {
  return isLogin() ? <Navigate to={"appointments"} /> : <Outlet />;
};

export default ProtectedRoute;
