import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getAllUsers } from "../../api/services/users.service";
import CreateAppointment from "./CreateAppointment";

const SetAppointment = () => {
  const dispatch = useDispatch();
  const [isUserLoading, setIsUserLoading] = useState(false);

  const { users } = useSelector((state: any) => state.users);
  const { auth } = useSelector((state: any) => state.auth);

  useEffect(() => {
    getAllUsers(dispatch, setIsUserLoading);
  }, [dispatch]);
  const filteredUsers = users[0]?.filter(
    (user: any) => user.UserID !== auth?.userId
  );
  return (
    <div className="flex flex-col w-max mx-auto">
      <div className="text-2xl font-semibold flex gap-1 justify-center items-center">
        <p className="hidden md:block w-24 h-[2px] bg-[#8645a8] mt-1"></p>
        <p className="w-max text-center text-black">Create an Appointment</p>
        <p className="hidden md:block w-24 h-[2px] bg-[#8645a8] mt-1"></p>
      </div>

      <CreateAppointment users={filteredUsers} />
    </div>
  );
};

export default SetAppointment;
