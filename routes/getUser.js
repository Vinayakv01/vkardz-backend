const express = require('express');
const db = require('../services/db');

const router = express.Router();

// Get user's information route
router.get('/', (req, res) => {
  const userID = req.userID; // Get the user's ID from the authUser middleware

  // Fetch the user's information from the database
  const selectQuery = `
    SELECT Username, Name, Phone, Email
    FROM users
    WHERE UserID = ?
  `;

  db.query(selectQuery, [userID], (err, result) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    if (result.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const userData = result[0];
    res.json(userData);
  });
});

module.exports = router;
