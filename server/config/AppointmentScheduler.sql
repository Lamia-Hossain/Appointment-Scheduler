DROP DATABASE appointment_scheduler;

CREATE DATABASE appointment_scheduler;

USE appointment_scheduler;

CREATE TABLE User (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(255) UNIQUE NOT NULL,
    Password VARCHAR(255) NOT NULL
);

CREATE TABLE Appointment (
    AppointmentID INT AUTO_INCREMENT PRIMARY KEY,
    Title VARCHAR(255) NOT NULL,
    Description TEXT NOT NULL,
    Date DATE NOT NULL,
    Time TIME NOT NULL,
    ScheduledBy INT NOT NULL,  -- the user who schedules the appointment
    ScheduledWith INT NOT NULL, -- the user with whom the appointment is scheduled
    Status ENUM('Pending', 'Accepted', 'Declined', 'Cancelled') DEFAULT 'Pending', -- to handle accept/decline/cancel/pending
    AudioMessage BLOB, -- optional audio message

    FOREIGN KEY (ScheduledBy) REFERENCES User(UserID),
    FOREIGN KEY (ScheduledWith) REFERENCES User(UserID)
);
