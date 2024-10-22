import privateRequest, { publicRequest } from "../apiConfig";
import { addAuthData, editAuthData } from "../../store/features/authSlice";
import { toast } from "react-toastify";
import { Dispatch } from "redux";
import { NavigateFunction } from "react-router-dom";

interface AuthData {
  password: string;
  [key: string]: any;
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
      url: `/user/login`,
      data,
    });
    dispatch(addAuthData(res.data));
    localStorage.setItem("termin", res.data?.token);
    navigate("/user/appointments");
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
      url: `/user/register`,
      data,
    });
    dispatch(addAuthData(res.data));
    navigate("/", { replace: true });
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
