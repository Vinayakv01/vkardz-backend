const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost', // Database host
  user: 'your_username', // Database username
  password: 'your_password', // Database password
  database: 'your_database', // Database name
});

connection.connect((err) => {
  if (err) {
    console.error('Database connection failed: ', err);
    return;
  }
  console.log('Connected to the database');
});

module.exports = connection;
