import { toast } from "react-toastify";
import privateRequest, { publicRequest } from "./apiConfig";
import { Dispatch } from "redux"; // Assuming you're using Redux
import { AxiosRequestConfig, AxiosResponse } from "axios";

// Define the types for API options and the response
interface ApiOptions extends AxiosRequestConfig {}
interface SuccessAction<T = any> {
  (data: T): { type: string; payload: T }; // Action creator
}

/**
 * @function privateRequestHandler
 * @description Handles private API requests with a given configuration, dispatches the result to the store, and manages the loading state.
 * @param {ApiOptions} options - Configuration options for the API request (method, url, data, etc.)
 * @param {Dispatch} dispatch - Redux dispatch function to update the store with the response data.
 * @param {React.Dispatch<React.SetStateAction<boolean>>} setIsLoading - Function to manage the loading state.
 * @param {SuccessAction} successAction - Redux action to be dispatched on successful API response.
 * @param {string} [message] - Optional success message to show after the request completes.
 * @returns {Promise<void>} - Returns a promise that resolves once the request is complete.
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
 * @description Handles public API requests with a given configuration, dispatches the result to the store, and manages the loading state.
 * @param {ApiOptions} options - Configuration options for the API request (method, url, data, etc.)
 * @param {Dispatch} dispatch - Redux dispatch function to update the store with the response data.
 * @param {React.Dispatch<React.SetStateAction<boolean>>} setIsLoading - Function to manage the loading state.
 * @param {SuccessAction} successAction - Redux action to be dispatched on successful API response.
 * @returns {Promise<void>} - Returns a promise that resolves once the request is complete.
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
