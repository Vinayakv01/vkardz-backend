
// Import necessary modules and middleware
const express = require('express');
const db = require('../services/db');
const authenticate = require('./auth');

const router = express.Router();

// API route to update a user by CompanyAdminID and userID
router.post('/CompanyAdmin/:CompanyAdminID/users/:userID/update', authenticate, (req, res) => {
  const { CompanyAdminID, userID } = req.params;
  const { updatedUserData } = req.body; // Assuming you send the updated user data in the request body



  // Perform the database update operation based on CompanyAdminID, userID, and updatedUserData

  const updateQuery = 'UPDATE users SET Name = ?, CompanyName = ?, Username = ?, Password = ? WHERE CompanyAdminID = ? AND UserID = ?';

  // Execute the update query with the provided data
  db.query(updateQuery, [updatedUserData.Name, updatedUserData.CompanyName, updatedUserData.Username, updatedUserData.Password, CompanyAdminID, userID], (err, result) => {
    if (err) {
      console.error('Error updating user:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      console.log('User updated successfully');
      res.json({ message: 'User updated successfully' });
    }
  });


  // Respond with a success message or error message
});

module.exports = router;
