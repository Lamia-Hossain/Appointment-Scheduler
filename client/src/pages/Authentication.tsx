import { Player } from "@lottiefiles/react-lottie-player";
import { Card } from "antd";

const Authentication = () => {
  return (
    <div className="flex flex-row flex-wrap gap-10 items-center">
      <Player
        autoplay
        loop
        src="https://lottie.host/5305d59e-b867-4ec4-9854-78a935fd7d98/PPkQUPIv8Z.json"
        style={{ height: 520, width: 520 }}
      />

      <Card style={{ width: 400 }} className="shadow">
        <h1 className="text-2xl md:text-4xl font-semibold">Login</h1>
      </Card>
    </div>
  );
};

export default Authentication;
