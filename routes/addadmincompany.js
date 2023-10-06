const express = require('express');
const db = require('../services/db');
const authenticate = require('./auth');


const router = express.Router();

// Login route
router.post('/', authenticate, (req, res) => {
  const { Name, CompanyName, Username, Password } = req.body;

  console.log('Inserting data into companyadmin table');
  console.log('Received data from frontend:', req.body);

  // Implement the logic to insert data into the companyadmin table
  const insertQuery = 'INSERT INTO companyadmin (Name, CompanyName, Username, Password) VALUES (?, ?, ?, ?)';
  console.log('SQL Query:', insertQuery);

  db.query(insertQuery, [Name, CompanyName, Username, Password], (err, result) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    console.log('Data inserted into the companyadmin table');
    res.json({ message: 'Data inserted successfully' });
  });
});

module.exports = router;
