import { Link, useLocation } from "react-router-dom";
import UserInfo from "./UserInfo";

const TopBar = () => {
  const location = useLocation();
  return (
    <>
      <div className="md:ml-[170px] fixed top-0 right-0 left-0 h-12 bg-white text-black hidden lg:flex items-center px-3 shadow z-40">
        <p className="text-lg font-medium">
          {location.pathname === "/appointments"
            ? "Appointments"
            : location.pathname === "/users"
            ? "Users"
            : ""}
        </p>
      </div>

      <div className="text-lg font-semibold fixed lg:hidden grid grid-cols-12 items-center top-0 right-0 left-0 bg-white text-black shadow z-40">
        <Link
          className={`col-span-4 p-1 md:p-3 ${
            location.pathname === "/appointments" && "bg-blue-50"
          }`}
          to="/appointments"
        >
          Appointments
        </Link>
        <Link
          className={`col-span-4 p-1 md:p-3 border-x-2 ${
            location.pathname === "/users" && "bg-blue-50"
          }`}
          to="/users"
        >
          Users
        </Link>
        <div className="col-span-4 flex justify-end gap-3 p-1 md:p-3">
          <UserInfo />
        </div>
      </div>
    </>
  );
};

export default TopBar;
