import { Dispatch } from "redux";
import { getUsers } from "../../store/features/usersSlice";
import privateRequest from "../apiConfig";
import { toast } from "react-toastify";

export const getAllUsers = async (
  dispatch: Dispatch,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setIsLoading(true);
  await privateRequest({
    method: "GET",
    url: `/user`,
  })
    .then((res) => {
      dispatch(getUsers(res.data));
    })
    .catch((error) => {
      toast.error(error.response?.data?.error);
    })
    .finally(() => {
      setIsLoading(false);
    });
};

export const getUserById = async (userId: string | number) => {
  const response = await privateRequest({
    method: "GET",
    url: `/user/${userId}`,
  });
  return response.data.Name;
};
