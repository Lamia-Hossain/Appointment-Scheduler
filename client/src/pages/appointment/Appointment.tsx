import { ConfigProvider, Tabs } from "antd";
import SetAppointment from "../../components/appointments/SetAppointment";
import SeeAppointments from "../../components/appointments/SeeAppointments";

const Appointment = () => {
  const tabsLabel = ["Request for appointment", "See Appointments"];
  const tabsChildren = [<SetAppointment />, <SeeAppointments />];

  const customTheme = {
    token: {
      colorPrimary: "#8645a8",
      colorText: "#9974ad",
      colorTextTertiary: "#43334c",
    },
  };

  return (
    <div className="mt-12 lg:mt-10">
      <ConfigProvider theme={customTheme}>
        <Tabs
          defaultActiveKey="1"
          centered
          items={new Array(2).fill(null).map((_, i) => {
            const id = String(i + 1);
            return {
              label: tabsLabel[i],
              key: id,
              children: tabsChildren[i],
            };
          })}
        />
      </ConfigProvider>
    </div>
  );
};

export default Appointment;
