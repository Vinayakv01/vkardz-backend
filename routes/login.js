const express = require('express');
const db = require('../services/db');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Login route
router.post('/', (req, res) => {
  const { username, password } = req.body;

  // Query the database to validate the username and password
  const query = 'SELECT * FROM users WHERE Username = ? AND Password = ?';
  db.query(query, [username, password], (err, result) => {
    if (err) {
      console.error('Error executing SQL query: ', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    // Check if the user exists
    if (result.length === 0) {
      console.log('Invalid username or password:', username);
      res.status(401).json({ error: 'Invalid username or password' });
      return;
    }

    // Generate and sign the JWT token
    const user = result[0]; // Assuming the result contains the user data
    const token = generateJwtToken(user.UserID, user.Username,'user');

    

    console.log('Login successful:', username);

    // Set the JWT token as an HTTP-only cookie in the response
    res.cookie('jwtToken', token, {
      httpOnly: true,
      maxAge: 3600000, // 1 hour in milliseconds
    });

    // Return a success message to the client (optional)
    res.json({ message: 'Login successful', userID: user.UserID, userType: 'user' });
  });
});

// Function to generate a JWT token
function generateJwtToken(userID, username, userType) {
  const secretKey = process.env.JWT_SECRET_KEY;
  const token = jwt.sign({ userID, username, userType, isAdmin: false }, secretKey, { expiresIn: '1h' });
  return token;
}

module.exports = router;
