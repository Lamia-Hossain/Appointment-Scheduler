import { toast } from "react-toastify";
import privateRequest, { publicRequest } from "./apiConfig";
import { Dispatch } from "redux";
import { AxiosRequestConfig, AxiosResponse } from "axios";

// Define the types for API options and the response
interface ApiOptions extends AxiosRequestConfig {}
interface SuccessAction<T = any> {
  (data: T): { type: string; payload: T };
}

/**
 * @function privateRequestHandler
 * @description
 * @param {ApiOptions} options
 * @param {Dispatch} dispatch
 * @param {React.Dispatch<React.SetStateAction<boolean>>} setIsLoading
 * @param {SuccessAction} successAction
 * @param {string} [message]
 * @returns {Promise<void>}
 */
const privateRequestHandler = async (
  options: ApiOptions,
  dispatch: Dispatch,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  successAction: SuccessAction,
  message?: string
): Promise<void> => {
  setIsLoading(true);
  try {
    const res: AxiosResponse = await privateRequest(options);
    dispatch(successAction(res.data));
    toast.success(message || res.data.message);
  } catch (error: any) {
    toast.error(error.response?.data?.message || "An error occurred.");
    throw new Error(error.response?.data?.message || "Request failed");
  } finally {
    setIsLoading(false);
  }
};

/**
 * @function publicRequestHandler
 * @description
 * @param {ApiOptions} options
 * @param {Dispatch} dispatch
 * @param {React.Dispatch<React.SetStateAction<boolean>>} setIsLoading
 * @param {SuccessAction} successAction
 * @returns {Promise<void>}
 */
const publicRequestHandler = async (
  options: ApiOptions,
  dispatch: Dispatch,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  successAction: SuccessAction
): Promise<void> => {
  setIsLoading(true);
  try {
    const res: AxiosResponse = await publicRequest(options);
    dispatch(successAction(res.data));
  } catch (error: any) {
    toast.error(error.response?.data?.message || "An error occurred.");
    throw new Error(error.response?.data?.message || "Request failed");
  } finally {
    setIsLoading(false);
  }
};

export { privateRequestHandler, publicRequestHandler };
