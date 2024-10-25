import { Outlet } from "react-router-dom";
import SideBar from "../layouts/SideBar";
import TopBar from "../layouts/TopBar";

const PrivateRoute = () => {
  return (
    <>
      <SideBar />
      <TopBar />
      <div className="ml-0 lg:ml-[170px]">
        <Outlet />
      </div>
    </>
  );
};

export default PrivateRoute;
