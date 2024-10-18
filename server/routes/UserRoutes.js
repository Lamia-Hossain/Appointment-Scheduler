// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");

// Register a new user
router.post("/register", UserController.registerUser);

// Login user
router.post("/login", UserController.loginUser);

// Update user with file upload middleware
router.put("/:id", UserController.editUser);

// Get user by ID
router.get("/:id", UserController.getUserById);

// Get all users
router.get("/", UserController.getAllUsers);

// update password with email
router.put("/:id/password-and-email", UserController.updatePasswordAndName);

module.exports = router;
