import { Card } from "antd";
import { Form, Formik, FormikHelpers } from "formik";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Slide } from "react-awesome-reveal";

import Field from "../../components/forms/Field";
import { register } from "../../api/services/auth.services";
import { authValidate } from "../../validation/auth.schema";
import { AuthFormValues } from "../../validation/dataTypes";
import clockCalendar from "../../assets/clock-calendar.png";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = (
    { name, password }: AuthFormValues,
    { setSubmitting }: FormikHelpers<AuthFormValues>
  ) => {
    const data = { name, password };
    register(setIsLoading, data, dispatch, navigate);
    setSubmitting(false);
  };

  return (
    <div className="flex flex-row flex-wrap gap-10 lg:gap-20 items-center">
      <Slide direction="left">
        <img
          src={clockCalendar}
          alt="clock-calendar"
          className="w-[500px] h-[500px]"
        />
      </Slide>

      <Slide direction="right">
        <Card style={{ width: 350 }} className="shadow">
          <h1 className="text-2xl font-semibold">
            Connect Globally
            <br />
            Schedule Today!
          </h1>

          <Formik
            initialValues={{
              name: "",
              password: "",
            }}
            validationSchema={authValidate}
            onSubmit={handleSignup}
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
                  name="Signup"
                  isLoading={isLoading}
                  buttonText="Signup"
                />
              </Form>
            )}
          </Formik>

          <p>
            Already have an account?
            <span>
              <Link to="/" className="hover:underline">
                {" "}
                Login!
              </Link>
            </span>
          </p>
        </Card>
      </Slide>
    </div>
  );
};

export default Signup;
