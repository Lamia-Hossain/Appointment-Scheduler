import { Table, Input } from "antd";
import { User } from "../../validation/dataTypes";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getAllUsers } from "../../api/services/users.service";

const UserList = () => {
  const dispatch = useDispatch();
  const [isUserLoading, setIsUserLoading] = useState(false);
  const [searchText, setSearchText] = useState<string>("");

  const { users } = useSelector((state: any) => state.users);
  const { auth } = useSelector((state: any) => state.auth);

  useEffect(() => {
    getAllUsers(dispatch, setIsUserLoading);
  }, [dispatch]);

  const filteredUsers = users[0]?.filter(
    (user: any) =>
      user?.UserID !== auth?.userId &&
      user?.Name?.toLowerCase().includes(searchText?.toLowerCase())
  );

  const columns = [
    {
      title: "SL",
      dataIndex: "UserID",
      key: "index",
      align: "center" as "center",
      render: (index: number) => (
        <p className="hover:cursor-pointer">{index + 1}</p>
      ),
    },
    {
      title: "Name",
      dataIndex: "Name",
      key: "username",
      align: "center" as "center",
      render: (text: any, record: User, index: number) => (
        <p className="hover:cursor-pointer">{record.Name}</p>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2 items-center ml-auto">
        <Input
          placeholder="Search by name"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 125 }}
        />

        <p>Total: {filteredUsers.length}</p>
      </div>
      <Table
        columns={columns}
        dataSource={filteredUsers}
        rowKey="UserID"
        pagination={false}
        className="border rounded-md w-[300px] overflow-auto max-h-[500px]"
      />
    </div>
  );
};

export default UserList;
