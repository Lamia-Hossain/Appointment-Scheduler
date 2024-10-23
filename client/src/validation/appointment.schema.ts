import * as Yup from "yup";

export const apointmentValidate = Yup.object({
  title: Yup.string().required("Title is required"),
  description: Yup.string(),
  date: Yup.string().required("Please select a date"),
  time: Yup.string().required("Please select a time"),
  scheduledWith: Yup.number().required(),
});
