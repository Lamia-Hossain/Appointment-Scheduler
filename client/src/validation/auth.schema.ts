import * as Yup from "yup";

export const authValidate = Yup.object({
  name: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
});
