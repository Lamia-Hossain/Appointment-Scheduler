import { ConfigProvider, Tabs } from "antd";
import SetAppointment from "../../components/appointments/SetAppointment";
import SeeAppointments from "../../components/appointments/SeeAppointments";

const Appointment = () => {
  const tabsLabel = ["Request for appointment", "See Appointments"];
  const tabsChildren = [<SetAppointment />, <SeeAppointments />];

  const customTheme = {
    token: {
      colorPrimary: "#437C90", // Change the primary color
      colorText: "#437C90", // Change text color
      colorTextTertiary: "#437C90", // Change tertiary text color for tab hover
    },
  };

  return (
    <div className="lg:pt-[26px] lg:pl-48">
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
