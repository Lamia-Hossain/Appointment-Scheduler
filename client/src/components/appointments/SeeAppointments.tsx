import { useEffect, useState } from "react";
import {
  ConfigProvider,
  Segmented,
  Table,
  Tag,
  TableColumnsType,
  Input,
  Tooltip,
} from "antd";
import {
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  UndoOutlined,
  EditTwoTone,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  editAppointmentStatus,
  getAllAppointmentsByUserId,
} from "../../api/services/appointment.service";
import { Appointment } from "../../validation/dataTypes";
import { getUserById } from "../../api/services/users.service";
import GeneralModal from "../GeneralModal";
import EditAppointment from "./EditAppointment";

const SeeAppointments = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment>();
  const [modal, setModal] = useState(false);
  const [value, setValue] = useState<string>("All");
  const [searchText, setSearchText] = useState<string>("");
  const { auth } = useSelector((state: any) => state.auth);
  const { appointments } = useSelector((state: any) => state.appointments);
  const [usersMap, setUsersMap] = useState<{ [key: string]: string }>({});

  const toggleModal = () => setModal(!modal);

  const handleUpdateStatus = async (
    appointmentId: number,
    newStatus: string
  ) => {
    await editAppointmentStatus(
      appointmentId,
      newStatus,
      setIsLoading,
      dispatch
    );
    fetchAppointments();
  };

  const fetchAppointments = async () => {
    setIsLoading(true);
    await getAllAppointmentsByUserId(setIsLoading, auth.userId, dispatch);
  };

  const fetchUsers = async () => {
    if (!appointments?.length) return;

    const userPromises = appointments.map(
      (appointment: { ScheduledWith: string | number }) =>
        getUserById(appointment.ScheduledWith)
    );

    try {
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
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [auth.userId, dispatch]);

  useEffect(() => {
    fetchUsers();
  }, [appointments]);

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
              <div className="flex gap-2 justify-center">
                <Tooltip title="Accept">
                  <CheckCircleTwoTone
                    onClick={() =>
                      handleUpdateStatus(record.AppointmentID, "Accepted")
                    }
                    className="cursor-pointer"
                    twoToneColor="#52c41a"
                  />
                </Tooltip>
                <Tooltip title="Decline">
                  <CloseCircleTwoTone
                    onClick={() =>
                      handleUpdateStatus(record.AppointmentID, "Declined")
                    }
                    className="cursor-pointer"
                    twoToneColor="#eb2f96"
                  />
                </Tooltip>
              </div>
            );
          } else {
            return (
              <div className="flex gap-2 justify-center">
                <Tooltip title="Edit">
                  <EditTwoTone
                    onClick={() => {
                      setSelectedAppointment(record);
                      toggleModal();
                    }}
                    className="cursor-pointer"
                    twoToneColor="#44bbe3"
                  />
                </Tooltip>
                <Tooltip title="Cancel">
                  <CloseCircleTwoTone
                    onClick={() =>
                      handleUpdateStatus(record.AppointmentID, "Cancelled")
                    }
                    className="cursor-pointer"
                    twoToneColor="#eb2f96"
                  />
                </Tooltip>
              </div>
            );
          }
        } else {
          return (
            <Tooltip title="Undo">
              <UndoOutlined
                onClick={() =>
                  handleUpdateStatus(record.AppointmentID, "Pending")
                }
                style={{ cursor: "pointer" }}
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
    { Pending: 0, Accepted: 0, Declined: 0, Cancelled: 0 }
  );

  const filteredAppointments = appointments.filter(
    (appointment: Appointment) =>
      (value === "All" || appointment?.Status === value) &&
      (appointment?.Title?.toLowerCase().includes(searchText?.toLowerCase()) ||
        appointment?.Description?.toLowerCase().includes(
          searchText?.toLowerCase()
        ) ||
        appointment?.Title?.toLowerCase().includes(searchText?.toLowerCase()))
  );

  const rowClassName = (record: Appointment): string => {
    return isUpcoming(record.Date, record.Time) ? "upcoming-row" : "";
  };

  return (
    <>
      <div className="flex flex-col gap-5 mx-auto justify-center items-center">
        <p className="text-2xl text-center font-semibold text-black">
          Status Of Your Appointments
        </p>
        <Segmented
          options={[
            `All (${appointments?.length})`,
            `Pending (${statusCounts?.Pending})`,
            `Accepted (${statusCounts?.Accepted})`,
            `Declined (${statusCounts?.Declined})`,
            `Cancelled (${statusCounts?.Cancelled})`,
          ]}
          onChange={(value) => setValue(value.split(" ")[0])}
          sizes="medium"
        />
        <Input
          placeholder="Search by title or description"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ marginTop: 10, width: 250 }}
        />
        <div className="overflow-x-auto md:w-[90%] my-3">
          <ConfigProvider
            theme={{
              components: {
                Table: {
                  headerBg: "#9974ad",
                  headerColor: "white",
                  colorText: "#3C3D37",
                },
              },
            }}
          >
            <Table
              columns={columns}
              dataSource={filteredAppointments}
              bordered
              pagination={{
                pageSize: 5,
                position: ["bottomCenter"],
              }}
              rowClassName={rowClassName}
            />
          </ConfigProvider>
        </div>
      </div>

      {modal && selectedAppointment && (
        <GeneralModal
          title="Edit Your Appointment"
          onClose={() => {
            toggleModal();
            setSelectedAppointment(undefined);
          }}
        >
          <EditAppointment prev_appointment={selectedAppointment} />
        </GeneralModal>
      )}
    </>
  );
};

export default SeeAppointments;
