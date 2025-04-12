"use strict";
debugger;
const mysql2 = require("mysql2");
require("dotenv").config();

const pool_connection = mysql2.createPool({
  user: process.env.DBMS_CONNECTION_USER,
  host: process.env.DBMS_CONNECTION_HOST,
  password: process.env.DBMS_CONNECTION_PASSWORD,
  port: process.env.DBMS_CONNECTION_PORT,
  database: process.env.DBMS_CONNECTION_DATABASE,
});

pool_connection.getConnection((error, connection) => {
  error
    ? console.log("ERROR WHILE CONNECTING TO DB!", error)
    : console.log("Connected to database successfully!");
});

module.exports = pool_connection.promise();
