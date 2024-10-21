import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    auth: [],
  },
  reducers: {
    addAuthData: (state, { payload }) => {
      state.auth = payload;
    },
    editAuthData: (state, { payload }) => {
      state.auth["nid"] = payload.nid || "";
      state.auth["contact_number"] = payload.contact_number || "";
    },
  },
});

export const { addAuthData, editAuthData } = authSlice.actions;
export default authSlice.reducer;
