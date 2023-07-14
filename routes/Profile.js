const express = require('express');
const router = express.Router();
const db = require('../services/db');

// Create Profile route
router.post('/', (req, res) => {
  // Extract profile data from the request body
  const { UserID, ProfileName, Designation, CompanyName, ProfileImageURL, QRCodeImageURL, IsDefaultProfile, Mobile, Email } = req.body;

  // Insert the profile data into the database
  const query = 'INSERT INTO Profile (UserID, ProfileName, Designation, CompanyName, ProfileImageURL, QRCodeImageURL, IsDefaultProfile, Mobile, Email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
  db.query(query, [UserID, ProfileName, Designation, CompanyName, ProfileImageURL, QRCodeImageURL, IsDefaultProfile, Mobile, Email], (err, result) => {
    if (err) {
      console.error('Error executing SQL query: ', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    res.status(201).json({ message: 'Profile created successfully', profileID: result.insertId });
  });
});

module.exports = router;
