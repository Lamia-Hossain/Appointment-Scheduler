import privateRequest, { publicRequest } from "../apiConfig";
import { addAuthData, editAuthData } from "../../store/features/authSlice";
import { toast } from "react-toastify";
import { Dispatch } from "redux";
import { NavigateFunction } from "react-router-dom";

// Define types for the data and dispatch functions
interface AuthData {
  password: string;
  [key: string]: any; // For additional fields
}

interface ProfileData {
  firstName: string;
  lastName: string;
  [key: string]: any;
}

// Login function
export const login = async (
  data: AuthData,
  dispatch: Dispatch,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  navigate: NavigateFunction
): Promise<void> => {
  setIsLoading(true);
  try {
    const res = await publicRequest({
      method: "POST",
      url: `jwt-auth/v1/token/`,
      data,
    });
    dispatch(addAuthData(res.data));
    localStorage.setItem("pahonaToken", res.data?.token);
    navigate(res.data.role === "ADMIN" ? "/admin/dashboard" : "/dashboard");
    toast.success("Login successful!");
  } catch (err: any) {
    toast.error(err.response?.data?.message);
  } finally {
    setIsLoading(false);
  }
};

// Register function
export const register = async (
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  data: AuthData,
  dispatch: Dispatch,
  navigate: NavigateFunction
): Promise<void> => {
  setIsLoading(true);
  try {
    const res = await publicRequest({
      method: "POST",
      url: `custom/v1/register`,
      data,
    });
    dispatch(addAuthData(res.data));
    navigate("/login", { replace: true });
    toast.success("Please check your mail address");
  } catch (err: any) {
    toast.error(err.response?.data?.message);
  } finally {
    setIsLoading(false);
  }
};

// Edit profile function
export const editProfile = async (
  data: ProfileData,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  dispatch: Dispatch
): Promise<void> => {
  setLoading(true);
  try {
    const res = await privateRequest({
      method: "POST",
      url: `custom/v1/update-user-info/`,
      data,
    });
    dispatch(editAuthData(res.data));
    toast.success(res.data.message);
  } catch (error: any) {
    toast.error(error.response?.data?.message);
    throw Error(error.response?.data?.message);
  } finally {
    setLoading(false);
  }
};
