import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: [],
  userInfo: null,
};

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    getUsers: (state, action) => {
      state.users = action.payload;
    },
    getUserByUserId: (state, action) => {
      state.userInfo = action.payload;
    },
  },
});

export const { getUsers, getUserByUserId } = usersSlice.actions;
export default usersSlice.reducer;
