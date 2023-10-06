// routes/companyadminLogout.js

const express = require('express');
const cookieParser = require('cookie-parser');

const router = express.Router();
router.use(cookieParser());

router.post('/', (req, res) => {
  // Clear the companyAdminJwtToken cookie to log the user out
  res.clearCookie('companyAdminJwtToken');
  res.json({ message: 'Company admin logout successful' });
});

module.exports = router;
