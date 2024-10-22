import { Player } from "@lottiefiles/react-lottie-player";
import { Card } from "antd";
import { Form, Formik, FormikHelpers } from "formik";
import { useNavigate } from "react-router-dom";
import Field from "../components/forms/Field";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { login } from "../api/services/auth.services";
import * as Yup from "yup";

// Type for form values
interface LoginFormValues {
  username: string;
  password: string;
}

// Yup validation schema for login form
const loginValidate = Yup.object({
  username: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
});

const Authentication: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // State to manage loading status
  const [isLoading, setIsLoading] = useState(false);

  // Handle form submission with proper types
  const handleSubmit = (
    values: LoginFormValues,
    { setSubmitting }: FormikHelpers<LoginFormValues>
  ) => {
    const { username, password } = values;
    const data = { username, password };

    login(data, dispatch, setIsLoading, navigate);
    setSubmitting(false);
  };

  return (
    <div className="flex flex-row flex-wrap gap-10 items-center">
      <Player
        autoplay
        loop
        src="https://lottie.host/5305d59e-b867-4ec4-9854-78a935fd7d98/PPkQUPIv8Z.json"
        style={{ height: 520, width: 520 }}
      />

      <Card style={{ width: 350 }} className="shadow">
        <h1 className="text-2xl font-semibold">
          Get It Done
          <br />
          Schedule Today!
        </h1>
        <Formik
          initialValues={{
            username: "",
            password: "",
          }}
          validationSchema={loginValidate}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form className="flex flex-col gap-3 items-center mt-5">
              <Field
                label="Username"
                type="text"
                name="username"
                placeholder="Username / Email"
                className="block w-full px-3 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />

              <Field
                label="Password"
                type="password"
                name="password"
                placeholder="Password"
                className="block w-full px-3 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />

              <Field
                type="submit"
                name="Login"
                isLoading={isLoading}
                buttonText="Login"
              />
            </Form>
          )}
        </Formik>
      </Card>
    </div>
  );
};

export default Authentication;
