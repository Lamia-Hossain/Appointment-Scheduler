import { Player } from "@lottiefiles/react-lottie-player";
import { Card } from "antd";
import { Form, Formik, FormikHelpers } from "formik";
import { Link, useNavigate } from "react-router-dom";
import Field from "../../components/forms/Field";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { login } from "../../api/services/auth.services";
import { Slide } from "react-awesome-reveal";
import { AuthFormValues } from "../../validation/dataTypes";
import { authValidate } from "../../validation/auth.schema";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // State to manage loading status
  const [isLoading, setIsLoading] = useState(false);

  // Handle form submission with proper types
  const handleSubmit = (
    values: AuthFormValues,
    { setSubmitting }: FormikHelpers<AuthFormValues>
  ) => {
    const { name, password } = values;
    const data = { name, password };

    login(data, dispatch, setIsLoading, navigate);
    setSubmitting(false);
  };

  return (
    <div className="flex flex-row flex-wrap gap-10 lg:gap-20 items-center">
      <Slide direction="left">
        <Player
          autoplay
          loop
          src="https://lottie.host/5305d59e-b867-4ec4-9854-78a935fd7d98/PPkQUPIv8Z.json"
          style={{ height: 500, width: 500 }}
        />
      </Slide>

      <Slide direction="right">
        <Card style={{ width: 350 }} className="shadow">
          <h1 className="text-2xl font-semibold">
            Get It Done
            <br />
            Schedule Today!
          </h1>

          <Formik
            initialValues={{
              name: "",
              password: "",
            }}
            validationSchema={authValidate}
            onSubmit={handleSubmit}
          >
            {() => (
              <Form className="flex flex-col gap-3 items-center my-5">
                <Field
                  label="Username"
                  type="text"
                  name="name"
                  placeholder="Username"
                />

                <Field
                  label="Password"
                  type="password"
                  name="password"
                  placeholder="Password"
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

          <p>
            New here?
            <span>
              <Link to="/sign-up" className="hover:underline">
                {" "}
                Sign up today!
              </Link>
            </span>
          </p>
        </Card>
      </Slide>
    </div>
  );
};

export default Login;
