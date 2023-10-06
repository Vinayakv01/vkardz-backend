const express = require('express');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const db = require('../services/db');

const router = express.Router();
router.use(cookieParser());

// CompanyAdmin login route
router.post('/', (req, res) => {
  const { username, password } = req.body;

  // Query the database for the company admin user with the given username and password
  const query = 'SELECT * FROM companyadmin WHERE Username = ? AND Password = ?';

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

    const companyAdmin = result[0];
    const token = generateJwtToken(companyAdmin.CompanyAdminID, companyAdmin.Username, 'companyadmin'); // Include userType

    console.log('CompanyAdmin login successful', username);

    res.cookie('companyAdminJwtToken', token, {
      httpOnly: true,
      maxAge: 3600000, // 1 hour
    });
    res.json({ message: 'CompanyAdmin login successful', CompanyAdminID: companyAdmin.CompanyAdminID, userType: 'companyadmin' });
  });
});

function generateJwtToken(companyAdminID, username, userType) {
  const secretKey = process.env.JWT_SECRET_KEY_COMPANYADMIN;
  const token = jwt.sign({ companyAdminID, username, userType }, secretKey, { expiresIn: '1h' });
  return token;
}


module.exports = router;
