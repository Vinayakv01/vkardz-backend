// routes/updateUser.js

const express = require('express');
const db = require('../services/db');

const router = express.Router();

// Update user's information route
router.put('/', (req, res) => {
  const { username, fullname, phoneNumber, email } = req.body;
  const userID = req.userID; // Get the user's ID from the authUser middleware

  console.log('Received update request with the following data:');
  console.log('Username:', username);
  console.log('Full Name:', fullname);
  console.log('Phone Number:', phoneNumber);
  console.log('Email:', email);
  console.log('UserID:', userID);

  // Update the user's information in the database
  const updateQuery = `
    UPDATE users
    SET Username = ?, Name = ?, Phone = ?, Email = ?
    WHERE UserID = ?
  `;

  db.query(updateQuery, [username, fullname, phoneNumber, email, userID], (err, result) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    console.log('User information updated successfully:', result);

    res.json({ message: 'User information updated successfully' });
  });
});





module.exports = router;