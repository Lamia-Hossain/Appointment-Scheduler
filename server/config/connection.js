const mysql = require("mysql2");
require("dotenv").config();

const connection = mysql.createConnection({
  port: process.env.DB_PORT,
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

connection.connect((error) => {
  if (error) {
    console.error("Error connecting with DB:", error);
  } else {
    console.log("Connected to DB on port:", process.env.DB_PORT);
  }
});

module.exports = connection;
