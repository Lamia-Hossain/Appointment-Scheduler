import CreateAppointment from "./CreateAppointment";

const SetAppointment = () => {
  return (
    <div className="flex flex-col w-max mx-auto">
      <div className="text-2xl text-black font-semibold flex gap-1 justify-center items-center">
        <p className="hidden md:block w-24 h-[2px] bg-[#437C90] mt-1"></p>
        <p className="w-max text-center"></p>Create an Appointment
        <p className="hidden md:block w-24 h-[2px] bg-[#437C90] mt-1"></p>
      </div>

      <CreateAppointment />
    </div>
  );
};

export default SetAppointment;
