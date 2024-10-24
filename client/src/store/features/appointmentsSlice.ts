import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Appointment {
  id: string;
  title: string;
  description: string;
  scheduledWith: number;
  time: string;
  date: string;
}

interface AppointmentState {
  appointments: Appointment[];
}

const initialState: AppointmentState = {
  appointments: [],
};

export const appointmentSlice = createSlice({
  name: "appointment",
  initialState,
  reducers: {
    getAppointments: (state, action: PayloadAction<Appointment[]>) => {
      state.appointments = action.payload;
    },
    getAppointmentsByUserId: (state, action: PayloadAction<Appointment[]>) => {
      state.appointments = action.payload;
    },
    addAppointmentData: (state, action: PayloadAction<Appointment>) => {
      state.appointments.unshift(action.payload);
    },
    editAppointmentData: (state, action: PayloadAction<Appointment>) => {
      const index = state.appointments.findIndex(
        (data) => data.id === action.payload.id
      );
      if (index !== -1) {
        state.appointments[index] = action.payload;
      }
    },
  },
});

export const {
  getAppointments,
  getAppointmentsByUserId,
  addAppointmentData,
  editAppointmentData,
} = appointmentSlice.actions;

export default appointmentSlice.reducer;
