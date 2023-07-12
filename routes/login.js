const express = require('express');
const router = express.Router();
const db = require('../services/db');
const jwt = require('jsonwebtoken');

// Login route
router.post('/', (req, res) => {
  const { username, password } = req.body;

  // Query the database to validate the username and password
  const query = 'SELECT * FROM User WHERE Username = ? AND Password = ?';
  db.query(query, [username, password], (err, result) => {
    if (err) {
      console.error('Error executing SQL query: ', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    // Check if the user exists
    if (result.length === 0) {
      res.status(401).json({ error: 'Invalid username or password' });
      return;
    }

    // Generate and sign the JWT token
    const user = result[0]; // Assuming the result contains the user data
    const token = generateJwtToken(user.UserID, user.Username);

    // Return the token to the client
    res.json({ token });
  });
});

// Function to generate a JWT token
function generateJwtToken(userID, username) {
  const secretKey = 'your_secret_key'; // Replace with your secret key
  const token = jwt.sign({ userID, username }, secretKey);
  return token;
}

module.exports = router;
