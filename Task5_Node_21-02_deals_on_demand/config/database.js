const mysql = require("mysql2");

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "Smit@0212",
    database: "task17_db_14_02",
    port: 3307,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  }, console.log("Database connected"));

module.exports = db;