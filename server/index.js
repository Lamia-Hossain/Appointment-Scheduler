const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");

// Load environment variables
dotenv.config();

// Create express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Ensure the uploads/audio directory exists
const audioDir = path.join(__dirname, "uploads/audio");
if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir, { recursive: true });
}

// Serve static files (for accessing uploaded audio files)
app.use(
  "/uploads/audio",
  express.static(path.join(__dirname, "uploads/audio"))
);

// Import routes
const userRoutes = require("./routes/UserRoutes");
const appointmentRoutes = require("./routes/AppointmentRoutes");

// Use routes
app.use("/user", userRoutes);
app.use("/appointment", appointmentRoutes);

// Set the port
const port = process.env.PORT || 8080;

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
