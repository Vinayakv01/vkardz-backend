// routes/updatePassword.js

const express = require('express');
const db = require('../services/db');
const authUser = require('./authUser'); // Import the authentication middleware

const router = express.Router();

// Apply the authentication middleware to the route
router.use(authUser);

// Route to check old password and update with new password
router.put('/updatepassword', (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userID = req.userID; // Get the user's ID from the authUser middleware

  console.log('Received password update request with the following data:');
  console.log('UserID:', userID);
  console.log('Old Password:', oldPassword);
  console.log('New Password:', newPassword);

  // Check the old password against the stored password hash
  const getPasswordQuery = 'SELECT Password FROM users WHERE UserID = ?';
  db.query(getPasswordQuery, [userID], (err, result) => {
    if (err) {
      console.error('Error fetching stored password:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    const storedPassword = result[0].Password;

    // Compare the old password provided with the stored hash
    if (oldPassword !== storedPassword) {
      res.status(400).json({ error: 'Old password is incorrect' });
      return;
    }

    // Update the user's password in the database
    const updatePasswordQuery = 'UPDATE users SET Password = ? WHERE UserID = ?';
    db.query(updatePasswordQuery, [newPassword, userID], (updateErr) => {
      if (updateErr) {
        console.error('Error updating password:', updateErr);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }

      console.log('Password updated successfully');

      res.status(200).json({ message: 'Password updated successfully' });
    });
  });
});

module.exports = router;