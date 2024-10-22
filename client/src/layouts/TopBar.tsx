import { Link, useLocation } from "react-router-dom";

const TopBar = () => {
  const location = useLocation();
  return (
    <>
      <div className="md:ml-[170px] fixed top-0 right-0 left-0 h-12 bg-white text-black hidden lg:flex items-center px-3 shadow">
        <p className="text-lg font-medium">
          {location.pathname === "/appointments"
            ? "Appointments"
            : location.pathname === "/users"
            ? "Users"
            : ""}
        </p>
      </div>

      <div className="text-lg font-semibold fixed lg:hidden grid grid-cols-12 items-center top-0 right-0 left-0 bg-white text-black shadow">
        <Link
          className={`col-span-6 p-1 md:p-3 ${
            location.pathname === "/appointments" && "bg-blue-50"
          }`}
          to="/appointments"
        >
          Appointments
        </Link>
        <Link
          className={`col-span-6 p-1 md:p-3 ${
            location.pathname === "/users" && "bg-blue-50"
          }`}
          to="/users"
        >
          Users
        </Link>
      </div>
    </>
  );
};

export default TopBar;
