import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    auth: {}, // Change from array to object
    users: [],
  },
  reducers: {
    addAuthData: (state, { payload }) => {
      state.auth = payload; // Set the entire auth object to the payload
    },
    getUsers: (state, { payload }) => {
      state.users = payload;
    },
  },
});

export const { addAuthData, getUsers } = authSlice.actions;
export default authSlice.reducer;
