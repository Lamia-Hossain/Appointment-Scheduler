import { Outlet } from "react-router-dom";
import SideBar from "../layouts/SideBar";
// Internal dependencies
import { getToken, tokenDecoded } from "../utils/tokenHelper";
import TopBar from "../layouts/TopBar";

interface Role {
  roles: any;
}

// Protects routes by checking if the user has the required role
const PrivateRoute = ({ roles }: Role) => {
  // If no token or role mismatch, log out the user
  if (!getToken() || !roles.includes(tokenDecoded().role)) {
    console.log("Logout");
  }

  return (
    <>
      <SideBar />
      <TopBar />
      <Outlet />
    </>
  );
};

export default PrivateRoute;
