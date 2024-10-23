const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/UserModel");

class UserController {
  async registerUser(req, res) {
    try {
      const { name, password } = req.body;

      // Check if the user with the provided name already exists
      const existingUser = await User.getUserByName(name);
      console.log(existingUser);

      if (existingUser.length > 0) {
        return res
          .status(400)
          .json({ error: "User with the same name already exists" });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = {
        Name: name,
        Password: hashedPassword,
      };

      const result = await User.createUser(newUser);

      const token = jwt.sign(
        { userId: result[0].insertId },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      console.log("JWT Secret:", process.env.JWT_SECRET);
      res.status(201).json({
        message: "User registered successfully",
        token,
        userId: result[0].insertId,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async loginUser(req, res) {
    try {
      const { name, password } = req.body;

      // Check if the user with the provided name exists
      const user = await User.getUserByName(name);
      if (!user || user.length === 0) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }

      // Compare the provided password with the hashed password in the database
      const isPasswordValid = await bcrypt.compare(password, user[0].Password);
      if (!isPasswordValid) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }

      // Create a JWT token
      const token = jwt.sign(
        { userId: user[0].UserID },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.status(200).json({ token, userId: user[0].UserID, expiresIn: "1h" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async editUser(req, res) {
    try {
      const userId = req.params.id;
      const { Name, Password } = req.body;

      const updatedUser = { Name };

      // Hash the password if it's provided in the request
      if (Password) {
        const hashedPassword = await bcrypt.hash(Password, 10);
        updatedUser.Password = hashedPassword;
      }

      await User.updateUser(userId, updatedUser);

      res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getUserById(req, res) {
    try {
      const userId = req.params.id;
      const result = await User.getUserById(userId);

      if (!result.length) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      const user = result[0];

      const filteredUser = {
        // UserID: user.UserID,
        Name: user.Name,
      };

      res.status(200).json(filteredUser);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAllUsers(req, res) {
    try {
      const users = await User.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new UserController();
