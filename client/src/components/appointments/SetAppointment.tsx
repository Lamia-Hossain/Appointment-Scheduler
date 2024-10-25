import CreateAppointment from "./CreateAppointment";

const SetAppointment = () => {
  return (
    <div className="flex flex-col w-max mx-auto">
      <div className="text-2xl font-semibold flex gap-1 justify-center items-center">
        <p className="hidden md:block w-24 h-[2px] bg-[#8645a8] mt-1"></p>
        <p className="w-max text-center text-black">Create an Appointment</p>
        <p className="hidden md:block w-24 h-[2px] bg-[#8645a8] mt-1"></p>
      </div>

      <CreateAppointment />
    </div>
  );
};

export default SetAppointment;
