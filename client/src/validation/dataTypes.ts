export type AuthFormValues = {
  name: string;
  password: string;
};

export type User = {
  Name: string;
  UserID: number;
};

export type Appointment = {
  AppointmentID: number;
  Title: string;
  Description: string;
  Date: string;
  Time: string;
  ScheduledBy: number;
  ScheduledWith: number;
  Status: string;
  AudioMessage: null;
};
