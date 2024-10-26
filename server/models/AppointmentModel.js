const db = require("../config/connection");

class Appointment {
  // Create a new appointment
  async createAppointment(appointmentData) {
    const sqlQuery = "INSERT INTO Appointment SET ?";
    return await db.promise().query(sqlQuery, [appointmentData]);
  }

  // Get appointment by ID
  async getAppointmentById(appointmentId) {
    const sqlQuery = "SELECT * FROM Appointment WHERE AppointmentID = ?";
    return await db.promise().query(sqlQuery, [appointmentId]);
  }

  // Get all appointments
  async getAllAppointments() {
    const sqlQuery = "SELECT * FROM Appointment";
    return await db.promise().query(sqlQuery);
  }

  // Update appointment status (for 'Pending', 'Accepted', 'Declined', 'Cancelled')
  async updateAppointmentStatus(appointmentId, status) {
    const sqlQuery =
      "UPDATE Appointment SET Status = ? WHERE AppointmentID = ?";
    return await db.promise().query(sqlQuery, [status, appointmentId]);
  }

  // Update appointment details (Title, Description, Date, Time, ScheduledWith)
  async updateAppointmentDetails(appointmentId, updatedData) {
    const sqlQuery = `
      UPDATE Appointment 
      SET Title = ?, Description = ?, Date = ?, Time = ?, ScheduledWith = ?
      WHERE AppointmentID = ?`;

    // Destructure fields using exact keys
    const { Title, Description, Date, Time, ScheduledWith } = updatedData;

    return await db
      .promise()
      .query(sqlQuery, [
        Title,
        Description,
        Date,
        Time,
        ScheduledWith,
        appointmentId,
      ]);
  }

  // Delete an appointment
  async deleteAppointment(appointmentId) {
    const sqlQuery = "DELETE FROM Appointment WHERE AppointmentID = ?";
    return await db.promise().query(sqlQuery, [appointmentId]);
  }

  // Get appointments for a specific user (either scheduled by or scheduled with)
  async getAppointmentsByUserId(userId) {
    const sqlQuery = `
      SELECT * FROM Appointment
      WHERE ScheduledBy = ? OR ScheduledWith = ? ORDER BY date DESC, time DESC`;
    return await db.promise().query(sqlQuery, [userId, userId]);
  }

  // Get upcoming and past appointments based on date and time
  async getAppointmentsByTime(userId, type) {
    const currentDate = new Date().toISOString().slice(0, 19).replace("T", " ");
    let sqlQuery = "";

    if (type === "upcoming") {
      sqlQuery = `
        SELECT * FROM Appointment
        WHERE (ScheduledBy = ? OR ScheduledWith = ?)
        AND CONCAT(Date, ' ', Time) >= ?`;
    } else {
      sqlQuery = `
        SELECT * FROM Appointment
        WHERE (ScheduledBy = ? OR ScheduledWith = ?)
        AND CONCAT(Date, ' ', Time) < ?`;
    }

    return await db.promise().query(sqlQuery, [userId, userId, currentDate]);
  }
}

module.exports = new Appointment();
