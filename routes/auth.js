const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Endpoint to check authentication status
router.get('/check-auth', (req, res) => {
  const jwtToken = req.cookies.jwtToken;
  const adminJwtToken = req.cookies.adminJwtToken; // Add this line for admin token
  const companyAdminJwtToken = req.cookies.companyAdminJwtToken; // Add this line for company admin token
  
  console.log('JWT Token:', jwtToken);
  console.log('Admin JWT Token:', adminJwtToken); // Add this line for admin token
  console.log('Company Admin JWT Token:', companyAdminJwtToken); // Add this line for company admin token

  if (!jwtToken && !adminJwtToken && !companyAdminJwtToken) {
    console.log('JWT token not found');
    res.status(401).json({ authenticated: false });
    return;
  }

  if (jwtToken) {
    jwt.verify(jwtToken, process.env.JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        console.error('Error verifying JWT token:', err);
        res.status(401).json({ authenticated: false });
      } else {
        console.log('User authenticated:', decoded);
        req.user = decoded;
        res.json({ authenticated: true, userType: 'user' });
      }
    });
  } else if (adminJwtToken) {
    jwt.verify(adminJwtToken, process.env.JWT_SECRET_KEY_ADMIN, (err, decoded) => {
      if (err) {
        console.error('Error verifying admin JWT token:', err);
        res.status(401).json({ authenticated: false });
      } else {
        console.log('Admin authenticated:', decoded);
        req.admin = decoded;
        res.json({ authenticated: true, userType: 'admin' });
      }
    });
  } else if (companyAdminJwtToken) {
    jwt.verify(companyAdminJwtToken, process.env.JWT_SECRET_KEY_COMPANYADMIN, (err, decoded) => {
      if (err) {
        console.error('Error verifying company admin JWT token:', err);
        res.status(401).json({ authenticated: false });
      } else {
        console.log('Company Admin authenticated:', decoded);
        req.companyAdmin = decoded;
        res.json({ authenticated: true, userType: 'companyadmin', companyAdminID: decoded.companyAdminID });
      }
    });
  }
});

module.exports = router;
