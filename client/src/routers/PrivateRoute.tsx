import { Outlet } from "react-router-dom";
import SideBar from "../layouts/SideBar";
import TopBar from "../layouts/TopBar";
import { getToken } from "../utils/tokenHelper";
import { NotFound } from "../layouts/NotFound";

const PrivateRoute = () => {
  const token = getToken();
  return (
    <>
      {token ? (
        <>
          <SideBar />
          <TopBar />
          <div className="ml-0 lg:ml-[170px]">
            <Outlet />
          </div>
        </>
      ) : (
        <NotFound />
      )}
    </>
  );
};

export default PrivateRoute;
