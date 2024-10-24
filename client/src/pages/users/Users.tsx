import UserList from "../../components/users/UserList";

const Users = () => {
  return (
    <div className="flex flex-col items-center gap-10 w-max mx-auto mt-16 lg:mt-14">
      <div className="text-2xl font-semibold flex gap-1 justify-center items-center">
        <p className="hidden md:block w-24 h-[2px] bg-[#8645a8] mt-1"></p>
        <p className="w-max text-center text-black">All User</p>
        <p className="hidden md:block w-24 h-[2px] bg-[#8645a8] mt-1"></p>
      </div>
      <UserList />
    </div>
  );
};

export default Users;
