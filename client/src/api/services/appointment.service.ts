import { toast } from "react-toastify";
import {
  getAppointmentsByUserId,
  addAppointmentData,
  editAppointmentData,
  getAppointments,
} from "../../store/features/appointmentsSlice";
import privateRequest from "../apiConfig";

// Define the AppointmentData interface
interface AppointmentData {
  title: string;
  description: string;
  scheduledWith: number;
  time: string | undefined;
  date: string | undefined;
  scheduledBy: number;
  status?: string;
  audioMessage?: string | null;
  [key: string]: any;
}

type DispatchType = (action: any) => void;

// Fetch all appointments
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

// Fetch appointments by user ID
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

// Add a new appointment
export const addAppointment = async (
  appointment_data: AppointmentData,
  setLoading: (loading: boolean) => void,
  dispatch: DispatchType
) => {
  setLoading(true);
  try {
    const formData = new FormData();

    Object.keys(appointment_data).forEach((key) => {
      formData.append(key as string, appointment_data[key]);
    });
    const res = await privateRequest({
      method: "POST",
      url: "/appointment",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    dispatch(addAppointmentData(res.data));
  } catch (error: any) {
    toast.error(error.response?.data?.error);
    throw Error(error.response?.data?.error);
  } finally {
    setLoading(false);
  }
};

// Edit the status of an appointment
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

// Fetch an appointment by ID
export const getAppointmentById = async (
  appointmentId: string,
  setIsLoading: (loading: boolean) => void,
  dispatch: DispatchType
) => {
  setIsLoading(true);
  try {
    const res = await privateRequest({
      method: "GET",
      url: `/appointment/${appointmentId}`,
    });

    dispatch(getAppointments(res.data));
    console.log("Fetched appointment:", res.data);
  } catch (error: any) {
    toast.error(error.response?.data?.message || "Error fetching appointment");
  } finally {
    setIsLoading(false);
  }
};
