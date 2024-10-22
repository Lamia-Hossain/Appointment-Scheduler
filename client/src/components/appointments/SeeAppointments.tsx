import React, { useEffect, useState } from "react";
import { ConfigProvider, Segmented, Table, Tag, TableColumnsType } from "antd";
import { EditTwoTone, DeleteTwoTone } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteAppointment,
  getAllAppointmentsByUserId,
} from "../../api/services/appointment.service";
import GeneralModal from "../GeneralModal";
import EditAppointment from "./EditAppointment";

export type Appointment = {
  id: string;
  date: string;
  time: string;
  appointment_status: string;
};

const SeeAppointments: React.FC = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [value, setValue] = useState<string>("requested");
  const [modal, setModal] = useState<boolean>(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  const { auth } = useSelector((state: any) => state.auth);
  const { appointments } = useSelector((state: any) => state.appointments);

  useEffect(() => {
    if (!appointments.length) {
      getAllAppointmentsByUserId(setIsLoading, auth.user_id, dispatch);
    }
  }, [appointments, auth.user_id, dispatch]);

  const toggleModal = () => setModal(!modal);

  const handleDeleteAppointment = (appointment_id: string) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      deleteAppointment(setIsLoading, dispatch, appointment_id);
    }
  };

  // Define columns with a proper type
  const columns: TableColumnsType<Appointment> = [
    { title: "Date", dataIndex: "date", key: "date", align: "center" },
    { title: "Time", dataIndex: "time", key: "time", align: "center" },
    {
      title: "Status",
      dataIndex: "appointment_status",
      key: "appointment_status",
      align: "center",
      render: (status: string) => {
        const colorMap: { [key: string]: string } = {
          requested: "blue",
          approved: "green",
          unapproved: "red",
        };
        return (
          <Tag color={colorMap[status] || "gray"}>{status?.toUpperCase()}</Tag>
        );
      },
    },
  ];

  // Conditionally add edit and delete columns if the value is "requested"
  if (value === "requested") {
    columns.push(
      {
        title: "Edit",
        key: "edit",
        align: "center",
        render: (_: any, record: Appointment) => (
          <EditTwoTone
            onClick={() => {
              setSelectedAppointment(record);
              toggleModal();
            }}
            style={{ cursor: "pointer" }}
          />
        ),
      },
      {
        title: "Delete",
        key: "delete",
        align: "center",
        render: (_: any, record: Appointment) => (
          <DeleteTwoTone
            onClick={() => handleDeleteAppointment(record.id)}
            style={{ cursor: "pointer" }}
            twoToneColor="#eb2f96"
          />
        ),
      }
    );
  }

  const statusCounts = appointments.reduce(
    (acc: { [key: string]: number }, { appointment_status }: Appointment) => {
      if (appointment_status) {
        acc[appointment_status.toLowerCase()] += 1;
      }
      return acc;
    },
    { requested: 0, approved: 0, unapproved: 0 }
  );

  const filteredAppointments = appointments.filter(
    (data: Appointment) => data.appointment_status?.toLowerCase() === value
  );

  return (
    <>
      <div className="flex flex-col gap-5 mx-auto justify-center items-center">
        <p className="text-2xl text-center font-semibold text-black">
          Status Of Your Appointments
        </p>
        <Segmented
          options={[
            `Requested (${statusCounts.requested})`,
            `Approved (${statusCounts.approved})`,
            `Unapproved (${statusCounts.unapproved})`,
          ]}
          onChange={(value) => setValue(value.split(" ")[0].toLowerCase())}
          size="large"
        />
        <div className="w-full lg:w-[90%] my-6">
          <ConfigProvider
            theme={{
              components: {
                Table: {
                  headerBg: "#255957",
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
            />
          </ConfigProvider>
        </div>
      </div>
      {modal && selectedAppointment && (
        <GeneralModal
          title="Edit Your Appointment"
          onClose={() => {
            toggleModal();
            setSelectedAppointment(null);
          }}
        >
          <EditAppointment prev_appointment={selectedAppointment} />
        </GeneralModal>
      )}
    </>
  );
};

export default SeeAppointments;
