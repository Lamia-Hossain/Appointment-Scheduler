import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, DatePicker, TimePicker, Typography } from "antd";
import dayjs from "dayjs";
import { editAppointment } from "../../api/services/appointment.service";
import { formatDateddMMyyyy } from "../../utils/handleDate";
import { Appointment } from "./SeeAppointments";

interface EditAppointmentProps {
  prev_appointment: Appointment;
}

const EditAppointment = ({ prev_appointment }: EditAppointmentProps) => {
  const today = dayjs();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const auth = useSelector((state: any) => state.auth.auth);

  const [newDate, setNewDate] = useState<string>(dayjs().format("YYYY-MM-DD"));
  const [newTime, setNewTime] = useState<string>(dayjs().format("HH:mm"));
  const [buttonText, setButtonText] = useState<string>("Edit Appointment");

  const handleEditAppointment = async () => {
    setButtonText("Updating...");

    const appointmentData = {
      id: Number(prev_appointment.id),
      date: newDate,
      time: newTime,
      title: auth.user_nickname,
      description: auth.user_email,
      scheduledWith: auth.contact_number,
      status: "requested",
    };

    try {
      await editAppointment(
        Number(prev_appointment.id),
        appointmentData,
        setIsLoading,
        dispatch
      );
      window.location.href = "/appointment";
    } catch (err: any) {
      console.error(err.response?.data?.message);
    }
  };

  return (
    <>
      <Typography.Text>
        Previous Appointment:{" "}
        <Typography.Text strong>
          {formatDateddMMyyyy(prev_appointment.date)} ({prev_appointment.time})
        </Typography.Text>
      </Typography.Text>

      <div className="h-96 overflow-auto flex flex-row flex-wrap gap-4 justify-center">
        <DatePicker
          open={true}
          disabledDate={(current) => current.isBefore(today, "day")}
          value={dayjs(newDate)}
          onChange={(newValue) => {
            if (newValue) {
              setNewDate(dayjs(newValue).format("YYYY-MM-DD"));
            }
          }}
          // disabledDate={(date) => isDateInArray(date)}
        />

        <TimePicker
          value={dayjs(newTime, "HH:mm")}
          onChange={(newValue) => {
            if (newValue) {
              setNewTime(dayjs(newValue).format("HH:mm"));
            }
          }}
          format="HH:mm"
          minuteStep={15}
        />
      </div>

      <div className="mx-auto mt-3">
        <Button
          onClick={handleEditAppointment}
          type="primary"
          loading={isLoading}
        >
          {buttonText}
        </Button>
      </div>
    </>
  );
};

export default EditAppointment;
