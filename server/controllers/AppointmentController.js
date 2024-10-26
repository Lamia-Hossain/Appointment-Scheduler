const Appointment = require("../models/AppointmentModel");
const moment = require("moment");

class AppointmentController {
  // Create a new appointment
  async createAppointment(req, res) {
    try {
      const appointmentData = req.body;

      appointmentData.status = "Pending";

      // Convert the time to 24-hour format
      const timeIn24HourFormat = moment(appointmentData.time, "hh:mm A").format(
        "HH:mm"
      );
      appointmentData.time = timeIn24HourFormat;

      // Create the appointment in the database
      const result = await Appointment.createAppointment(appointmentData);

      const appointmentId = result[0].insertId;
      const newAppointment = await Appointment.getAppointmentById(
        appointmentId
      );

      res.status(201).json({
        message: "Appointment created successfully",
        data: newAppointment[0],
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get appointment by ID
  async getAppointmentById(req, res) {
    try {
      const appointmentId = req.params.id;
      const [appointment] = await Appointment.getAppointmentById(appointmentId);

      if (!appointment) {
        res.status(404).json({ message: "Appointment not found" });
        return;
      }

      res.status(200).json(appointment[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get all appointments
  async getAllAppointments(req, res) {
    try {
      const [appointments] = await Appointment.getAllAppointments();
      res.status(200).json(appointments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Update appointment status (Accept/Decline/Cancel)
  async updateAppointmentStatus(req, res) {
    try {
      const appointmentId = req.params.id;
      const { status } = req.body;

      // Validate status
      if (!["Pending", "Accepted", "Declined", "Cancelled"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      const [appointment] = await Appointment.getAppointmentById(appointmentId);

      if (appointment.length === 0) {
        return res.status(404).json({ message: "Appointment not found" });
      }

      if (["Accepted", "Declined", "Cancelled", "Pending"].includes(status)) {
        const result = await Appointment.updateAppointmentStatus(
          appointmentId,
          status
        );
        if (result[0].affectedRows === 0) {
          return res.status(404).json({ message: "Appointment not found" });
        }
        return res
          .status(200)
          .json({ message: "Appointment status updated successfully" });
      } else {
        return res.status(403).json({
          message: "You are not authorized to change this appointment status",
        });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Update appointment details
  async updateAppointment(req, res) {
    const { appointmentId } = req.params; // Assuming you're passing the ID in the URL
    const updatedData = req.body; // Get the updated data from the request body

    try {
      const [result] = await Appointment.updateAppointmentDetails(
        appointmentId,
        updatedData
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Appointment not found" });
      }

      res.status(200).json({ message: "Appointment updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error updating appointment", error });
    }
  }

  // Delete an appointment
  async deleteAppointment(req, res) {
    try {
      const appointmentId = req.params.id;

      const result = await Appointment.deleteAppointment(appointmentId);
      if (result[0].affectedRows === 0) {
        return res.status(404).json({ message: "Appointment not found" });
      }

      res.status(200).json({ message: "Appointment deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get appointments by User ID (both scheduled by and scheduled with)
  async getAppointmentsByUserId(req, res) {
    try {
      const userId = req.params.userId;
      const [appointments] = await Appointment.getAppointmentsByUserId(userId);

      if (appointments.length === 0) {
        return res
          .status(404)
          .json({ message: "No appointments found for this user" });
      }

      res.status(200).json(appointments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get upcoming or past appointments for a user
  async getAppointmentsByTime(req, res) {
    try {
      const { userId, type } = req.params; // type can be 'upcoming' or 'past'

      const [appointments] = await Appointment.getAppointmentsByTime(
        userId,
        type
      );

      res.status(200).json(appointments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new AppointmentController();
