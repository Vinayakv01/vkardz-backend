const express = require('express');
const db = require('../services/db');

const router = express.Router();

// GET route to retrieve all user data
router.get('/getcompanyadminuser', (req, res) => {
  // Define the SQL query to fetch all user data
  const selectQuery = 'SELECT * FROM companyadmin';

  // Execute the SQL query
  db.query(selectQuery, (err, results) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    // Send the fetched user data as a JSON response
    res.json({ users: results });
  });
});










module.exports = router;