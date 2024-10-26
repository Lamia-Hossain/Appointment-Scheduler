import { useState, useEffect } from "react";
import { Button, Calendar, TimePicker, message } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { Appointment } from "../../validation/dataTypes";
import {
  editAppointment,
  getAllAppointmentsByUserId,
} from "../../api/services/appointment.service";
import { useDispatch, useSelector } from "react-redux";
import { formatDateddMMyyyy } from "../../utils/handleDate";
import UserList from "../users/UserList";
import { getUserById } from "../../api/services/users.service";
import { inputFieldCSS } from "../forms/Field";

interface PrevAppointmentProps {
  prev_appointment: Appointment;
}

const EditAppointment = ({ prev_appointment }: PrevAppointmentProps) => {
  const dispatch = useDispatch();
  const { auth } = useSelector((state: any) => state.auth);

  const [title, setTitle] = useState(prev_appointment?.Title || "");
  const [description, setDescription] = useState(
    prev_appointment?.Description || ""
  );
  const [date, setDate] = useState<Dayjs | undefined>(
    dayjs(prev_appointment?.Date)
  );
  const [time, setTime] = useState<Dayjs | undefined>(
    dayjs(prev_appointment?.Time, "HH:mm")
  );
  const [selectedUser, setSelectedUser] = useState<number | null>(
    prev_appointment?.ScheduledWith || null
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (prev_appointment) {
      setTitle(prev_appointment.Title);
      setDescription(prev_appointment.Description);
      setDate(dayjs(prev_appointment.Date));
      setTime(dayjs(prev_appointment.Time, "HH:mm"));
      setSelectedUser(prev_appointment.ScheduledWith);
    }
  }, [prev_appointment]);

  const handleUpdate = async () => {
    if (!selectedUser) {
      message.warning("Please select a user.");
      return;
    } else if (title === "") {
      message.warning("Please enter a title.");
      return;
    }

    const timeIn24HourFormat = time ? time.format("HH:mm") : undefined;
    const updatedAppointmentData = {
      title,
      description,
      date: date?.format("YYYY-MM-DD"),
      time: timeIn24HourFormat,
      scheduledWith: selectedUser,
      scheduledBy: auth.userId,
    };

    try {
      await editAppointment(
        prev_appointment?.AppointmentID.toString(),
        updatedAppointmentData,
        setIsLoading,
        dispatch
      );
      // message.success("Appointment updated successfully!");
      fetchAppointments();
    } catch (error) {
      message.error("Failed to update appointment.");
    }
  };

  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchUserName = async () => {
      if (selectedUser) {
        try {
          const name = await getUserById(selectedUser);
          setUserName(name);
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      }
    };
    fetchUserName();
  }, [selectedUser]);

  const fetchAppointments = async () => {
    setIsLoading(true);
    await getAllAppointmentsByUserId(setIsLoading, auth.userId, dispatch);
  };

  return (
    <div className="flex flex-col gap-3 items-center my-5">
      <p>
        Previous Appointment:{" "}
        <span>
          {formatDateddMMyyyy(prev_appointment?.Date)} ({prev_appointment?.Time}
          )
        </span>
      </p>

      <div className="h-[320px] overflow-y-auto overflow-x-hidden grid grid-cols-2 gap-3 md:gap-10 items-center">
        <div className="flex flex-col gap-3 col-span-2 md:col-span-1 w-[305px]">
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
              <p className="text-black text-start px-1 w-52 bg-gray-50 border border-gray-300 rounded-md shadow-sm">
                {userName}
              </p>
            </div>
            <UserList onUserSelect={(user) => setSelectedUser(user.UserID)} />
          </div>
        </div>

        <div className="flex flex-col gap-3 col-span-2 md:col-span-1 w-[305px]">
          <div className="flex flex-col items-start gap-1">
            <p className="font-semibold">Select a Date</p>
            <div className="w-[305px] border border-solid p-2 rounded-md">
              <Calendar
                fullscreen={false}
                onSelect={(selectedDate) => setDate(selectedDate)}
                disabledDate={(current) => current.isBefore(dayjs(), "day")}
                value={date}
              />
            </div>
          </div>

          <div className="flex flex-col items-start gap-1">
            <p className="font-semibold">Pick a Time</p>
            <TimePicker
              value={time}
              onChange={(newValue) => setTime(newValue || undefined)}
              format="HH:mm"
              style={{ width: "50%" }}
              minuteStep={15}
            />
          </div>
        </div>
      </div>

      <Button type="primary" loading={isLoading} onClick={handleUpdate}>
        Update Appointment
      </Button>
    </div>
  );
};

export default EditAppointment;
