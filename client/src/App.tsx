import { RouterProvider } from "react-router-dom";
import { Flip, ToastContainer } from "react-toastify";
import "./App.css";
import Index from "./routers/Index";

function App() {
  return (
    <div className="App font-poppins">
      <ToastContainer
        position="top-center"
        autoClose={4000}
        transition={Flip}
      />
      <RouterProvider router={Index} />
    </div>
  );
}

export default App;
