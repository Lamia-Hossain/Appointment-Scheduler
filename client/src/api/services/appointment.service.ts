import { toast } from "react-toastify";
import {
  getAppointmentsByUserId,
  addAppointmentData,
  editAppointmentData,
  getAppointments,
} from "../../store/features/appointmentsSlice";
import privateRequest from "../apiConfig";

interface AppointmentData {
  title: string;
  description: string;
  scheduledWith: number;
  time: string | undefined;
  date: string | undefined;
  scheduledBy: number;
  status?: string;
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
      url: `/appointment`,
    });
    dispatch(getAppointments(res.data));
  } catch (error: any) {
    toast.error(error.response?.data?.error);
  } finally {
    setIsLoading(false);
  }
};

export const getAllAppointmentsByUserId = async (
  setIsLoading: (loading: boolean) => void,
  userId: string,
  dispatch: DispatchType
) => {
  setIsLoading(true);
  try {
    const res = await privateRequest({
      method: "GET",
      url: `/appointment/user/${userId}`,
    });
    dispatch(getAppointmentsByUserId(res.data));
  } catch (error: any) {
    toast.error(error.response?.data?.error);
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
      url: "/appointment",
      data: appointment_data,
    });
    dispatch(addAppointmentData(res.data));
    toast.success("New appointment has been added!");
  } catch (error: any) {
    toast.error(error.response?.data?.error);
    throw Error(error.response?.data?.error);
  } finally {
    setLoading(false);
  }
};

export const editAppointmentStatus = async (
  appointmentId: number,
  status: string,
  setLoading: (loading: boolean) => void,
  dispatch: DispatchType
) => {
  setLoading(true);
  try {
    const res = await privateRequest({
      method: "PUT",
      url: `/appointment/${appointmentId}/status`,
      data: JSON.stringify({ status }),
    });
    dispatch(editAppointmentData(res.data));
    toast.success("Appointment status has been changed!");
  } catch (error: any) {
    toast.error(
      error.response?.data?.error || "Error updating appointment status"
    );
    throw new Error(
      error.response?.data?.error || "Error updating appointment status"
    );
  } finally {
    setLoading(false);
  }
};
