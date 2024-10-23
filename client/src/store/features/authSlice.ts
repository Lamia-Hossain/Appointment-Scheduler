import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    auth: {},
  },
  reducers: {
    addAuthData: (state, { payload }) => {
      state.auth = payload;
    },
  },
});

export const { addAuthData } = authSlice.actions;
export default authSlice.reducer;
