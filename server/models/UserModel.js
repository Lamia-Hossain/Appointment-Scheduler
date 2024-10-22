const db = require("../config/connection");

class User {
  async createUser(user) {
    const sqlQuery = "INSERT INTO User SET ?";
    return await db.promise().query(sqlQuery, [user]);
  }

  async getUserByName(name) {
    const sqlQuery = "SELECT * FROM User WHERE Name = ?";
    const [rows] = await db.promise().query(sqlQuery, [name]);
    return rows;
  }

  async getUserById(id) {
    const sqlQuery = "SELECT * FROM User WHERE UserID = ?";
    return await db.promise().query(sqlQuery, [id]);
  }

  async updateUser(id, user) {
    const sqlQuery = "UPDATE User SET ? WHERE UserID = ?";
    return await db.promise().query(sqlQuery, [user, id]);
  }

  async deleteUser(id) {
    const sqlQuery = "DELETE FROM User WHERE UserID = ?";
    return await db.promise().query(sqlQuery, [id]);
  }

  async getAllUsers() {
    const sqlQuery = "SELECT * FROM User";
    return await db.promise().query(sqlQuery);
  }

  async updatePasswordAndName(userId, newPassword, newName) {
    const sqlQuery = "UPDATE User SET Password = ?, Name = ? WHERE UserID = ?";
    return await db.promise().query(sqlQuery, [newPassword, newName, userId]);
  }

  async getUserNameByID(userID) {
    const sqlQuery = "SELECT Name FROM User WHERE UserID = ?";
    return await db.promise().query(sqlQuery, [userID]);
  }
}

module.exports = new User();
