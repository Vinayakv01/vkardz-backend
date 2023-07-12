const express = require('express');
const router = express.Router();
const db = require('../services/db');

// Registration route
router.post('/', (req, res) => {
  // Generate a random alphanumeric UserID
  const userID = generateRandomAlphanumeric(10); // Specify the desired length of the UserID

  // Extract other data from the request body
  const { name, username, email, phone, password } = req.body;

  // Insert the user data into the database
  const query = 'INSERT INTO User (UserID, Name, Username, Email, Phone, Password) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(query, [userID, name, username, email, phone, password], (err, result) => {
    if (err) {
      console.error('Error executing SQL query: ', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    res.status(201).json({ message: 'User registered successfully', userID });
  });
});

// Function to generate a random alphanumeric string
function generateRandomAlphanumeric(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

module.exports = router;
