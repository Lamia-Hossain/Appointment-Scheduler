import { useState, useEffect } from "react";
import { Calendar, TimePicker, Button, message, Table } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import {
  addAppointment,
  getAllAppointmentsByUserId,
} from "../../api/services/appointment.service";
import { User } from "../../validation/dataTypes";

interface CreateAppointmentProps {
  users: User[];
}

const CreateAppointment = ({ users }: CreateAppointmentProps) => {
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
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const createAppointment = async () => {
    if (!selectedUser) {
      message.warning("Please select a user.");
      return;
    }

    // Convert the time to 24-hour format using dayjs
    const timeIn24HourFormat = time ? time.format("HH:mm") : undefined;

    const appointmentData = {
      title,
      description,
      date: date?.format("YYYY-MM-DD"),
      time: timeIn24HourFormat, // Use the 24-hour format time
      scheduledWith: selectedUser?.UserID,
      scheduledBy: auth?.userId,
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
          appointments.map((appointment) =>
            dayjs(appointment.date).format("YYYY-MM-DD")
          )
        ),
      ];
      setMultipleDates(uniqueDates);
    }
  }, [appointments]);

  const isDateInArray = (date: Dayjs | undefined) => {
    return date
      ? multipleDates.some((d) => dayjs(d).isSame(date, "day"))
      : false;
  };

  const onDateSelect = (selectedDate: Dayjs) => {
    if (!isDateInArray(selectedDate)) {
      setDate(selectedDate);
    } else {
      message.warning("This date already has an appointment.");
    }
  };

  const onUserSelect = (record: User) => {
    setSelectedUser(record);
    message.info(`User ${record.Name} selected.`);
  };

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
    <div className="flex flex-col gap-3 items-center my-5">
      <div className="grid grid-cols-2 gap-3 md:gap-10">
        {/* Title, Description, User Table */}
        <div className="flex flex-col gap-3 col-span-2 md:col-span-1">
          <div className="flex flex-col items-start gap-1">
            <label className="font-semibold">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="border rounded p-2 w-full"
            />
          </div>

          <div className="flex flex-col items-start gap-1">
            <label className="font-semibold">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              className="border rounded p-2 w-full"
            />
          </div>

          <div className="flex flex-col items-start gap-1">
            <p className="font-semibold">
              Schedule With:{" "}
              <span className="text-black">{selectedUser?.Name}</span>
            </p>
            <Table
              columns={columns}
              dataSource={users}
              rowKey="UserID"
              onRow={(record) => ({
                onClick: () => onUserSelect(record),
              })}
              pagination={false}
              className="border rounded-md w-[260px] overflow-auto max-h-[267px]"
            />
          </div>
        </div>

        {/* Time, Date */}
        <div className="flex flex-col gap-3 col-span-2 md:col-span-1">
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

          <div className="flex flex-col items-start gap-1">
            <p className="font-semibold">Select a Date</p>
            <div className="w-[305px] border border-solid p-2 rounded-md">
              <Calendar
                fullscreen={false}
                onSelect={(selectedDate) => onDateSelect(selectedDate)}
                disabledDate={(current) => isDateInArray(current)}
                value={date}
              />
            </div>
          </div>
        </div>
      </div>

      <Button type="primary" loading={isLoading} onClick={createAppointment}>
        {buttonText}
      </Button>
    </div>
  );
};

export default CreateAppointment;
