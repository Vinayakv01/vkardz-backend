const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'localhost', 
  user: process.env.DB_USER, 
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

connection.connect((err) => {
  if (err) {
    console.error('Database connection failed: ', err.message);
    return;
  }
  console.log('Connected to the database');
});

module.exports = connection;
