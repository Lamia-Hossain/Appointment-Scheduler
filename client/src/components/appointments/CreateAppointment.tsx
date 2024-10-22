import React, { useEffect, useState } from "react";
import { DatePicker, TimePicker, Button, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import dayjs, { Dayjs } from "dayjs";
import { addAppointment } from "../../api/services/appointment.service";

const CreateAppointment: React.FC = () => {
  const today = dayjs();
  const dispatch = useDispatch();
  const auth = useSelector((state: any) => state.auth.auth);
  const appointments = useSelector(
    (state: any) => state.appointments.appointments
  );

  const [date, setDate] = useState<Dayjs | null>(today);
  const [time, setTime] = useState<Dayjs | null>(dayjs());
  const [buttonText, setButtonText] = useState("Create Appointment");
  const [multipleDates, setMultipleDates] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const createAppointment = async () => {
    setButtonText("Creating...");

    const appointmentData = {
      id: 1,
      date: date?.format("YYYY-MM-DD"),
      time: time?.format("hh:mm A"),
      title: auth.user_nickname,
      description: auth.user_email,
      scheduledWith: auth.contact_number,
      status: "requested",
    };

    try {
      await addAppointment(appointmentData, setIsLoading, dispatch);
      setButtonText("Great ! It's Created");
      message.success("Appointment created successfully!");

      setTimeout(() => {
        setButtonText("Create New Appointment");
      }, 3000);
    } catch (error) {
      setButtonText("Sorry ! Please Try Again.");
      message.error("Failed to create appointment.");
    }
  };

  // Update multiple dates whenever appointments change
  useEffect(() => {
    if (appointments && Array.isArray(appointments)) {
      // Remove duplicates and ensure consistent formatting
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

  // Check if the date is in the multipleDates array
  const isDateInArray = (date: Dayjs | null) => {
    return date
      ? multipleDates.some((d) => dayjs(d).isSame(date, "day"))
      : false;
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 justify-center w-full">
      <DatePicker
        disabledDate={(current) => isDateInArray(current)}
        value={date}
        onChange={(newValue) => setDate(newValue)}
        style={{ width: "50%" }}
      />

      <TimePicker
        value={time}
        onChange={(newValue) => setTime(newValue)}
        format="hh:mm A"
        style={{ width: "50%" }}
        minuteStep={15}
      />

      <div className="mx-auto mt-3">
        <Button
          type="primary"
          loading={isLoading}
          onClick={createAppointment}
          style={{
            backgroundColor: "#437C90",
            borderColor: "#437C90",
          }}
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
};

export default CreateAppointment;
