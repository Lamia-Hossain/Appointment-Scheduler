import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu } from "antd";
import {
  CalendarOutlined,
  UsergroupAddOutlined,
  IdcardTwoTone,
} from "@ant-design/icons";
import clockCalendar from "../assets/clock-calendar.png";

interface SidebarItem {
  key: string;
  icon: React.ReactNode;
  label: string;
  path: string;
}
const sidebarItems: SidebarItem[] = [
  {
    key: "1",
    icon: <CalendarOutlined />,
    label: "Appointments",
    path: "/appointments",
  },
  {
    key: "2",
    icon: <UsergroupAddOutlined />,
    label: "Users",
    path: "/users",
  },
];

const SideBar = () => {
  const location = useLocation();
  return (
    <div className="shadow fixed left-0 top-0 bottom-0 bg-violet-50 z-50 w-[170px] hidden lg:flex lg:flex-col items-center gap-3">
      <img
        src={clockCalendar}
        alt="clock-calendar"
        className="w-[150px] h-auto"
      />
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        style={{ width: 170 }}
      >
        {sidebarItems.map((el) => (
          <Menu.Item key={el.path} icon={el.icon}>
            <Link to={el.path}>{el.label}</Link>
          </Menu.Item>
        ))}
      </Menu>
      <div className="mt-auto p-4">
        <IdcardTwoTone style={{ cursor: "pointer" }} className="text-2xl" />
      </div>
    </div>
  );
};

export default SideBar;
