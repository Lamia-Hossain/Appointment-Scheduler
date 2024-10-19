import { Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";

const Layout = () => {
  const location = useLocation();
  if (!location.pathname.includes("admin")) {
    return (
      <>
        <Outlet />
      </>
    );
  }
  return (
    <>
      <Outlet />
    </>
  );
};

export default Layout;
