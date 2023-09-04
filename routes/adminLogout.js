const express = require('express');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const db = require('../services/db');

const router = express.Router();
router.use(cookieParser());

router.post('/', (req, res) => {
    // Clear the adminJwtToken cookie to log the user out
    res.clearCookie('adminJwtToken');
    res.json({ message: 'Admin logout successful' });
  });
  
  
  module.exports = router;