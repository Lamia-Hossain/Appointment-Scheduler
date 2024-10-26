import { IdcardTwoTone, LogoutOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import { useSelector } from "react-redux";
import { logout } from "../api/apiConfig";

const UserInfo = () => {
  const { auth } = useSelector((state: any) => state.auth);
  return (
    <>
      <div className="flex items-center gap-3">
        <IdcardTwoTone style={{ cursor: "pointer" }} className="text-2xl" />{" "}
        <p>{auth?.name}</p>
      </div>

      <Tooltip title="Logout">
        <LogoutOutlined
          onClick={() => {
            logout();
          }}
        />
      </Tooltip>
    </>
  );
};

export default UserInfo;
