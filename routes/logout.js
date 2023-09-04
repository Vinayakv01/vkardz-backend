// routes/logout.js (backend)

const express = require('express');
const router = express.Router();

// Route for logging out (clearing the JWT token from the HTTP-only cookie)
router.post('/', (req, res) => {
  // Clear the JWT token by setting it to an empty string
  res.cookie('jwtToken', '', {
    httpOnly: true,
    expires: new Date(0), // Set the expiration date to a past date to immediately clear the cookie
  });

  res.status(200).json({ message: 'Logout successful' });
});

module.exports = router;
