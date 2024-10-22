import { toast } from "react-toastify";
import {
  getAppointmentsByUserId,
  addAppointmentData,
  editAppointmentData,
  deleteAppointmentSuccess,
  getAppointments,
} from "../../store/features/appointmentsSlice";
import privateRequest from "../apiConfig";

// Define the types for appointment data and the dispatch function
interface AppointmentData {
  id: number;
  title: string;
  description: string;
  scheduledWith: number;
  time: string | undefined;
  date: string | undefined;
  status: string;
  // Add other fields as needed
}

type DispatchType = (action: any) => void;

export const getAllAppointments = async (
  setIsLoading: (loading: boolean) => void,
  dispatch: DispatchType
) => {
  setIsLoading(true);
  try {
    const res = await privateRequest({
      method: "GET",
      url: `/custom/v1/appointment/all`,
    });
    dispatch(getAppointments(res.data));
  } catch (error: any) {
    toast.error(error.response?.data?.message);
  } finally {
    setIsLoading(false);
  }
};

export const getAllAppointmentsByUserId = async (
  setIsLoading: (loading: boolean) => void,
  userId: string, // or number, depending on your userId type
  dispatch: DispatchType
) => {
  setIsLoading(true);
  try {
    const res = await privateRequest({
      method: "GET",
      url: `/custom/v1/appointment/user/${userId}`,
    });
    dispatch(getAppointmentsByUserId(res.data));
  } catch (error: any) {
    toast.error(error.response?.data?.message);
  } finally {
    setIsLoading(false);
  }
};

export const addAppointment = async (
  appointment_data: AppointmentData,
  setLoading: (loading: boolean) => void,
  dispatch: DispatchType
) => {
  setLoading(true);
  try {
    const res = await privateRequest({
      method: "POST",
      url: "/custom/v1/appointment/create",
      data: appointment_data,
    });
    dispatch(addAppointmentData(res.data));
    toast.success("New appointment has been added!");
  } catch (error: any) {
    toast.error(error.response?.data?.message);
    throw Error(error.response?.data?.message);
  } finally {
    setLoading(false);
  }
};

export const editAppointment = async (
  appointmentId: number,
  data: AppointmentData,
  setLoading: (loading: boolean) => void,
  dispatch: DispatchType
) => {
  setLoading(true);
  try {
    const res = await privateRequest({
      method: "POST",
      url: `/custom/v1/appointment/update/${appointmentId}`,
      data: data,
    });
    dispatch(editAppointmentData(res.data));
    toast.success("Your Appointment has been updated!");
  } catch (error: any) {
    toast.error(error.response?.data?.message);
    throw Error(error.response?.data?.message);
  } finally {
    setLoading(false);
  }
};

export const editAppointmentStatus = async (
  appointmentId: number,
  data: AppointmentData,
  setLoading: (loading: boolean) => void,
  dispatch: DispatchType
) => {
  setLoading(true);
  try {
    const res = await privateRequest({
      method: "POST",
      url: `/custom/v1/appointment/update-status/${appointmentId}`,
      data: data,
    });
    dispatch(editAppointmentData(res.data));
    toast.success("Appointment has been updated!");
  } catch (error: any) {
    toast.error(error.response?.data?.message);
    throw Error(error.response?.data?.message);
  } finally {
    setLoading(false);
  }
};

export const deleteAppointment = async (
  setIsLoading: (loading: boolean) => void,
  dispatch: DispatchType,
  appointment_id: string // or number
) => {
  setIsLoading(true);
  try {
    await privateRequest({
      method: "DELETE",
      url: `/custom/v1/appointment/delete/${appointment_id}`,
    });
    dispatch(deleteAppointmentSuccess(appointment_id));
    toast.success("Appointment has been deleted!");
  } catch (error: any) {
    toast.error(error.response?.data?.message);
  } finally {
    setIsLoading(false);
  }
};
