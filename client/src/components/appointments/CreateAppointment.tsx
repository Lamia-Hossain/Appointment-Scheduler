import { useState, useEffect } from "react";
import { Calendar, TimePicker, Button, message } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import {
  addAppointment,
  getAllAppointmentsByUserId,
} from "../../api/services/appointment.service";
import UserList from "../users/UserList";
import { User } from "../../validation/dataTypes";
import { inputFieldCSS } from "../forms/Field";

const CreateAppointment = () => {
  const today = dayjs();
  const dispatch = useDispatch();
  const appointments = useSelector(
    (state: any) => state.appointments.appointments
  );
  const { auth } = useSelector((state: any) => state.auth);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Dayjs | undefined>(today);
  const [time, setTime] = useState<Dayjs | undefined>(dayjs());
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [buttonText, setButtonText] = useState("Create Appointment");
  const [multipleDates, setMultipleDates] = useState<string[]>([]);
  const [audioMessage, setAudioMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const createAppointment = async () => {
    if (!selectedUser) {
      message.warning("Please select a user.");
      return;
    } else if (title === "") {
      message.warning("Please enter a title.");
      return;
    }

    const timeIn24HourFormat = time ? time.format("HH:mm") : undefined;

    // Check if the selected date and time is in the past
    const selectedDateTime = dayjs(
      `${date?.format("YYYY-MM-DD")} ${timeIn24HourFormat}`
    );
    if (selectedDateTime.isBefore(today, "minute")) {
      message.error("Selected date and time cannot be in the past.");
      return;
    }

    const appointmentData = {
      title,
      description,
      date: date?.format("YYYY-MM-DD"),
      time: timeIn24HourFormat,
      scheduledWith: selectedUser?.UserID,
      scheduledBy: auth?.userId,
      audioMessage,
    };

    try {
      await addAppointment(appointmentData, setIsLoading, dispatch);
      getAllAppointmentsByUserId(setIsLoading, auth.userId, dispatch);
      message.success("Appointment created successfully!");
      setButtonText("Appointment Created");
    } catch (error) {
      message.error("Failed to create appointment.");
      setButtonText("Create Appointment");
    }
  };

  useEffect(() => {
    if (appointments && Array.isArray(appointments)) {
      const uniqueDates = [
        ...new Set(
          appointments?.map((appointment) =>
            dayjs(appointment.date).format("YYYY-MM-DD")
          )
        ),
      ];
      setMultipleDates(uniqueDates);
    }
  }, [appointments]);

  const isDateInArray = (date: Dayjs | undefined) => {
    return date
      ? multipleDates?.some((d) => dayjs(d).isSame(date, "day"))
      : false;
  };

  const onUserSelect = (user: User) => {
    setSelectedUser(user);
    message.info(`User ${user.Name} selected.`);
  };

  const onDateSelect = (selectedDate: Dayjs) => {
    if (!isDateInArray(selectedDate)) {
      setDate(selectedDate);
    } else {
      message.warning("This date already has an appointment.");
    }
  };

  // const handleAudioRecorded = (base64Audio: string) => {
  //   setAudioMessage(base64Audio);
  // };

  return (
    <div className="flex flex-col gap-3 items-center my-5">
      <div className="grid grid-cols-2 gap-3 md:gap-10">
        <div className="flex flex-col gap-3 col-span-2 md:col-span-1">
          <div className="flex flex-col items-start gap-1">
            <label className="font-semibold">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className={`${inputFieldCSS}`}
            />
          </div>

          <div className="flex flex-col items-start gap-1">
            <label className="font-semibold">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              className={`${inputFieldCSS}`}
            />
          </div>

          <div className="flex flex-col items-start gap-1">
            <div className="font-semibold flex items-center gap-2">
              Schedule With:{" "}
              <p className="text-black text-start px-1 w-52 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                {selectedUser?.Name}
              </p>
            </div>
            <UserList onUserSelect={onUserSelect} />
          </div>
        </div>

        <div className="flex flex-col gap-3 col-span-2 md:col-span-1">
          <div className="flex flex-col items-start gap-1">
            <p className="font-semibold">Select a Date</p>
            <div className="w-[305px] border border-solid p-2 rounded-md">
              <Calendar
                fullscreen={false}
                onSelect={(selectedDate) => onDateSelect(selectedDate)}
                disabledDate={(current) =>
                  current.isBefore(today, "day") || isDateInArray(current)
                }
                value={date}
              />
            </div>
          </div>

          <div className="flex flex-col items-start gap-1">
            <p className="font-semibold">Pick a Time</p>
            <TimePicker
              value={time}
              onChange={(newValue) => setTime(newValue || undefined)}
              format="hh:mm A"
              style={{ width: "50%" }}
              minuteStep={15}
            />
          </div>

          {/* Audio Recorder Section */}
          {/* <div className="flex flex-col items-start gap-1">
            <p className="font-semibold">Record an Audio Message</p>
            <AudioRecorder onAudioRecorded={handleAudioRecorded} />
          </div> */}
        </div>
      </div>

      <Button type="primary" loading={isLoading} onClick={createAppointment}>
        {buttonText}
      </Button>
    </div>
  );
};

export default CreateAppointment;
