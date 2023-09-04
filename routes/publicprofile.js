const express = require('express');
const jwt = require('jsonwebtoken'); // Import JWT library
const db = require('../services/db');
const uuid = require('uuid'); // You'll need a library for UUID generation


const router = express.Router();

// Route to get the user's default profile
router.get('/:userID', (req, res) => {
  const userID = req.params.userID;
const userToken = req.cookies.userToken; // Read the token cookie
console.log('User Token:', userToken);

// Check if the user has a token
if (!userToken) {
  const newToken = jwt.sign({ userID }, 'your-secret-key'); // Generate a new JWT token
  const oneMonthInSeconds = 30 * 24 * 60 * 60; // 1 month in seconds
  res.cookie('userToken', newToken, { maxAge: oneMonthInSeconds * 1000 }); 
  console.log('userToken:', newToken);
// Set the token as a cookie with 1-month expiration

  // Increment visit count in the database
  incrementVisitCount(userID);

  // Fetch and return the user's profile
  fetchUserProfile(userID, res);
} else {
  // User already has a token, fetch profile
  fetchUserProfile(userID, res);
}
});

// Function to increment visit count
function incrementVisitCount(userID) {
  const incrementVisitCountQuery =
    'UPDATE Profile SET VisitCount = COALESCE(VisitCount, 0) + 1 WHERE UserID = ? AND IsDefaultProfile = 1';
  db.query(incrementVisitCountQuery, [userID], (err, updateResult) => {
    if (err) {
      console.error('Error executing SQL query: ', err);
    }
  });
}

// Function to fetch user profile
function fetchUserProfile(userID, res) {
  const getProfileQuery = 'SELECT * FROM Profile WHERE UserID = ? AND IsDefaultProfile = 1';
  db.query(getProfileQuery, [userID], (err, profileResults) => {
    if (err) {
      console.error('Error executing SQL query: ', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    // Check if the user has a default profile
    if (profileResults.length === 0) {
      res.status(404).json({ error: 'Default profile not found' });
      return;
    }

    const profileID = profileResults[0].ProfileID;

    // Retrieve the user's custom fields from the database
    const getCustomFieldsQuery = 'SELECT * FROM CustomField WHERE UserID = ? AND ProfileID = ?';
    db.query(getCustomFieldsQuery, [userID, profileID], (err, customFieldsResults) => {
      if (err) {
        console.error('Error executing SQL query: ', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }

      // Construct the user's profile object with custom fields
      const userProfile = {
        profileID: profileResults[0].ProfileID,
        profileName: profileResults[0].ProfileName,
        designation: profileResults[0].Designation,
        companyName: profileResults[0].CompanyName,
        profileImage: profileResults[0].ProfileImage,
        website: profileResults[0].Website,
        address: profileResults[0].Address,
        mobile: profileResults[0].Mobile,
        email: profileResults[0].Email,
        isDefaultProfile: true, // Always set to true for the default profile
        customFields: customFieldsResults.map(customField => ({
          customFieldID: customField.CustomFieldID,
          fieldName: customField.FieldName,
          value: customField.Value
        })),
      };

      // Send the user's profile as a response
      res.status(200).json(userProfile);
    });
  });
}

// Export the router to use in other parts of your application
module.exports = router;
