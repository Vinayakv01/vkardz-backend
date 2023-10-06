// routes/adminAuth.js

const express = require('express');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const db = require('../services/db');

const router = express.Router();
router.use(cookieParser());

// Admin login route
router.post('/', (req, res) => {
  const { username, password } = req.body;

  // Query the database for the admin user with the given username and password
  const query = 'SELECT * FROM admin WHERE Username = ? AND Password = ?';

  db.query(query, [username, password], (err, result) => {
    if (err) {
      console.error('Error executing SQL query: ', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    if (result.length === 0) {
      console.log('Invalid username or password:', username);
      res.status(401).json({ error: 'Invalid username or password' });
      return;
    }

    const admin = result[0];
    const token = generateJwtToken(admin.AdminID, admin.Username, 'admin'); // Include userType
  
    console.log('Admin login successful:', username);

    res.cookie('adminJwtToken', token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    res.json({ message: 'Admin login successful',AdminID : admin.AdminID,userType: 'admin'});
  });
});

function generateJwtToken(userID, username, userType) {
  const secretKey = process.env.JWT_SECRET_KEY_ADMIN;
  const token = jwt.sign({ userID, username, userType, isAdmin: true }, secretKey, { expiresIn: '1h' });
  return token;
}





module.exports = router;
