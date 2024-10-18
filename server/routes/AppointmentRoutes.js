const express = require("express");
const router = express.Router();

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: "./uploads/audio/",
  filename: function (req, file, cb) {
    cb(null, "audio_" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit audio file size to 10MB
}).single("audioMessage");

const appointmentController = require("../controllers/AppointmentController");

// Create a new appointment
router.post("/", upload, appointmentController.createAppointment);

// Get appointment by ID
router.get("/:id", appointmentController.getAppointmentById);

// Get all appointments
router.get("/", appointmentController.getAllAppointments);

// Update appointment status (Accept/Decline/Cancel)
router.put("/:id/status", appointmentController.updateAppointmentStatus);

// Update appointment details
router.put("/:appointmentId", appointmentController.updateAppointment);

// Delete an appointment by ID
router.delete("/:id", appointmentController.deleteAppointment);

// Get appointments by User ID (both scheduled by and scheduled with)
router.get("/user/:userId", appointmentController.getAppointmentsByUserId);

// Get upcoming or past appointments for a user
router.get("/user/:userId/:type", appointmentController.getAppointmentsByTime);

module.exports = router;
