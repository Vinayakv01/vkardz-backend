const express = require('express');
const router = express.Router();
const db = require('../services/db');
const authenticate = require('./auth');

// Endpoint to add new CompanyAdmin
router.post('/companyadmincsv/addcsv', authenticate, (req, res) => {
  const { companyAdminData } = req.body;

  if (!Array.isArray(companyAdminData)) {
    return res.status(400).json({ error: 'Invalid CompanyAdmin data format' });
  }

  const addedCompanyAdmins = [];

  for (const admin of companyAdminData) {
    // Change the property names to match the frontend's case
    const { Name, CompanyName, Username, Password } = admin;

    // Insert the CompanyAdmin data into the database
    const insertQuery = 'INSERT INTO companyadmin (Name, CompanyName, Username, Password) VALUES (?, ?, ?, ?)';
    db.query(insertQuery, [Name, CompanyName, Username, Password], (err, result) => {
      if (err) {
        console.error('Error executing SQL query: ', err);
      } else {
        addedCompanyAdmins.push({ Name, Username });
      }
    });
  }

  res.status(201).json({ message: 'CompanyAdmins added successfully' });
});

module.exports = router;
