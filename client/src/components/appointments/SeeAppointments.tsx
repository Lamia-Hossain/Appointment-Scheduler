import { useEffect, useState } from "react";
import { ConfigProvider, Segmented, Table, Tag, TableColumnsType } from "antd";
import {
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  StopTwoTone,
  UndoOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  editAppointmentStatus,
  getAllAppointmentsByUserId,
} from "../../api/services/appointment.service";
import { Appointment } from "../../validation/dataTypes";
import { getUserById } from "../../api/services/users.service";
import { Tooltip } from "antd";

const SeeAppointments = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [value, setValue] = useState<string>("Pending");
  const { auth } = useSelector((state: any) => state.auth);
  const { appointments } = useSelector((state: any) => state.appointments);
  const [usersMap, setUsersMap] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchUsers = async () => {
      const userPromises = appointments.map(
        (appointment: { ScheduledWith: string | number }) =>
          getUserById(appointment.ScheduledWith)
      );
      const users = await Promise.all(userPromises);
      const mappedUsers = appointments.reduce(
        (
          acc: { [x: string]: any },
          appointment: { ScheduledWith: string | number },
          index: number
        ) => {
          acc[appointment.ScheduledWith] = users[index];
          return acc;
        },
        {}
      );
      setUsersMap(mappedUsers);
    };

    if (appointments.length) {
      fetchUsers();
    }
  }, [appointments]);

  useEffect(() => {
    if (!appointments.length) {
      getAllAppointmentsByUserId(setIsLoading, auth.userId, dispatch);
    }
  }, [appointments, auth.userId, dispatch]);

  const handleChangeAppointmentStatus = (id: number, status: string) => {
    editAppointmentStatus(id, status, setIsLoading, dispatch);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "short",
      year: "numeric",
    };
    return date.toLocaleDateString("en-GB", options).replace(/ /g, "-");
  };

  const isUpcoming = (dateString: string, timeString: string): boolean => {
    const [hours, minutes] = timeString.split(":").map(Number);
    const appointmentDate = new Date(dateString);
    appointmentDate.setHours(hours, minutes, 0, 0);

    const currentDate = new Date();
    return appointmentDate > currentDate;
  };

  const columns: TableColumnsType<Appointment> = [
    {
      title: "Scheduled With",
      dataIndex: "ScheduledWith",
      key: "ScheduledWith",
      align: "center",
      render: (scheduledWithId: string) =>
        scheduledWithId === auth.userId
          ? "With Me"
          : usersMap[scheduledWithId] || "Unknown",
    },
    { title: "Title", dataIndex: "Title", key: "Title", align: "center" },
    {
      title: "Description",
      dataIndex: "Description",
      key: "Description",
      align: "center",
    },
    {
      title: "Date",
      dataIndex: "Date",
      key: "Date",
      align: "center",
      render: (date: string) => formatDate(date),
    },
    { title: "Time", dataIndex: "Time", key: "Time", align: "center" },
    {
      title: "Type",
      key: "type",
      align: "center",
      render: (record: Appointment) => {
        const upcoming = isUpcoming(record.Date, record.Time);
        return upcoming ? (
          <Tag color="orange">Upcoming</Tag>
        ) : (
          <Tag color="gray">Past</Tag>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (_: any, record: Appointment) => {
        if (record.Status === "Pending") {
          if (record.ScheduledWith === auth.userId) {
            return (
              <div>
                <Tooltip title="Accept">
                  <CheckCircleTwoTone
                    onClick={() =>
                      handleChangeAppointmentStatus(
                        record.AppointmentID,
                        "Accepted"
                      )
                    }
                    style={{ cursor: "pointer", marginRight: "8px" }}
                    twoToneColor="#52c41a"
                  />
                </Tooltip>
                <Tooltip title="Decline">
                  <CloseCircleTwoTone
                    onClick={() =>
                      handleChangeAppointmentStatus(
                        record.AppointmentID,
                        "Declined"
                      )
                    }
                    style={{ cursor: "pointer" }}
                    twoToneColor="#eb2f96"
                  />
                </Tooltip>
              </div>
            );
          } else {
            return (
              <Tooltip title="Cancel">
                <StopTwoTone
                  onClick={() =>
                    handleChangeAppointmentStatus(
                      record.AppointmentID,
                      "Cancelled"
                    )
                  }
                  style={{ cursor: "pointer" }}
                  twoToneColor="#eb2f96"
                />
              </Tooltip>
            );
          }
        } else {
          return (
            <Tooltip title="Undo">
              <UndoOutlined
                onClick={() =>
                  handleChangeAppointmentStatus(record.AppointmentID, "Pending")
                }
                style={{ cursor: "pointer" }}
                twoToneColor="#eb2f96"
              />
            </Tooltip>
          );
        }
      },
    },
  ];

  const statusCounts = appointments.reduce(
    (acc: { [key: string]: number }, { Status }: Appointment) => {
      if (Status) {
        acc[Status] += 1;
      }
      return acc;
    },
    { Pending: 0, Accepted: 0, Declined: 0 }
  );

  const filteredAppointments = appointments.filter(
    (data: Appointment) => data.Status === value
  );

  const rowClassName = (record: Appointment): string => {
    return isUpcoming(record.Date, record.Time) ? "upcoming-row" : "";
  };

  return (
    <div className="flex flex-col gap-5 mx-auto justify-center items-center">
      <p className="text-2xl text-center font-semibold text-black">
        Status Of Your Appointments
      </p>
      <Segmented
        options={[
          `Pending (${statusCounts.Pending})`,
          `Accepted (${statusCounts.Accepted})`,
          `Declined (${statusCounts.Declined})`,
        ]}
        onChange={(value) => setValue(value.split(" ")[0])}
        size="large"
      />
      <div className="w-full lg:w-[90%] my-6">
        <ConfigProvider
          theme={{
            components: {
              Table: {
                headerBg: "#9974ad",
                headerColor: "white",
              },
            },
          }}
        >
          <Table
            columns={columns}
            dataSource={filteredAppointments}
            pagination={{ pageSize: 15 }}
            loading={isLoading}
            style={{ textAlign: "center" }}
            rowClassName={rowClassName} // Apply row className based on appointment type
          />
        </ConfigProvider>
      </div>
    </div>
  );
};

export default SeeAppointments;
