import { useEffect, useState } from "react";
import { Calendar, TimePicker, Button, message, Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import dayjs, { Dayjs } from "dayjs";
import { addAppointment } from "../../api/services/appointment.service";
import { Form, Formik } from "formik";
import Field from "../forms/Field";
import { authValidate } from "../../validation/auth.schema";
import { getAllUsers } from "../../api/services/auth.services";

const CreateAppointment = () => {
  const today = dayjs();
  const dispatch = useDispatch();
  const auth = useSelector((state: any) => state.auth.auth);
  const appointments = useSelector(
    (state: any) => state.appointments.appointments
  );
  const { users } = useSelector((state: any) => state.users);

  const [date, setDate] = useState<Dayjs | undefined>(today);
  const [time, setTime] = useState<Dayjs | undefined>(dayjs());
  const [buttonText, setButtonText] = useState("Create Appointment");
  const [multipleDates, setMultipleDates] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  useEffect(() => {
    getAllUsers(setIsLoading, dispatch);
  }, [dispatch]);

  const createAppointment = async () => {
    if (!selectedUserId) {
      message.warning("Please select a user.");
      return;
    }

    setButtonText("Creating...");

    const appointmentData = {
      date: date?.format("YYYY-MM-DD"),
      time: time?.format("hh:mm A"),
      title: auth.user_nickname,
      description: auth.user_email,
      scheduledWith: Number(selectedUserId), // User ID from table selection
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

  // Handle user selection from table
  const onUserSelect = (record: any) => {
    setSelectedUserId(record.id); // Set the selected user's ID
    message.info(`User ${record.username} selected.`);
  };

  const columns = [
    {
      title: "SL",
      dataIndex: "id",
      key: "index",
      align: "center",
      render: (text: any, record: any, index: number) => index + 1,
    },
    {
      title: "Name",
      dataIndex: "username",
      key: "username",
      align: "center",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      align: "center",
    },
  ];

  return (
    <div>
      <Formik
        initialValues={{
          title: "",
          description: "",
          date: "",
          time: "",
          scheduledWith: undefined,
        }}
        validationSchema={authValidate}
        onSubmit={() => {}}
      >
        {() => (
          <Form className="flex flex-col gap-3 items-center my-5">
            <Field label="Title" type="text" name="title" placeholder="Title" />

            <Field
              label="Description"
              type="textarea"
              name="description"
              placeholder="Description"
            />

            <div className="w-[305px] border border-solid p-2 rounded-md">
              <Calendar
                fullscreen={false}
                onSelect={onDateSelect}
                disabledDate={(current) => isDateInArray(current)}
                value={date}
              />
            </div>

            <TimePicker
              value={time}
              onChange={(newValue) => setTime(newValue || undefined)}
              format="hh:mm A"
              style={{ width: "50%" }}
              minuteStep={15}
            />

            <Field
              type="submit"
              name="Create Appointment"
              isLoading={isLoading}
              buttonText="Create Appointment"
            />
          </Form>
        )}
      </Formik>

      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        onRow={(record) => ({
          onClick: () => onUserSelect(record),
        })}
        pagination={false}
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
