const express = require('express');
const router = express.Router();
const db = require('../services/db');
const authenticate = require('./auth');

// Helper function to generate a random alphanumeric string
function generateRandomAlphanumeric(length) {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    result += charset.charAt(randomIndex);
  }
  return result;
}

// Endpoint to add new users with CompanyAdminID and alphanumeric UserID
router.post('/admin/addusercompanycsv', authenticate, async (req, res) => {
  const { csvData } = req.body;
  const authenticatedCompanyAdminID = req.companyAdminID; // Get authenticated CompanyAdminID

  if (!Array.isArray(csvData)) {
    return res.status(400).json({ error: 'Invalid CSV data format' });
  }

  const addedUsers = [];

  for (const user of csvData) {
    const { name, username, password } = user;
    const userID = generateRandomAlphanumeric(10); // Generate a new UserID

    // Add the generated User ID and CompanyAdminID to the user data
    user.UserID = userID;
    user.CompanyAdminID = authenticatedCompanyAdminID;

    // Insert the user data into the database with the correct CompanyAdminID
    const insertQuery = 'INSERT INTO users (UserID, Name, Username, Password, CompanyAdminID) VALUES (?, ?, ?, ?, ?)';

    try {
      await db.query(insertQuery, [userID, name, username, password, authenticatedCompanyAdminID]);
      addedUsers.push({ userID, name, username });
    } catch (err) {
      console.error('Error executing SQL query: ', err);
    }
  }

  res.status(201).json({ message: 'Users added from CSV successfully', addedUsers });
});

module.exports = router;
