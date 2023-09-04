const express = require('express');
const db = require('../services/db');
const authenticate = require('./auth');

const router = express.Router();

// Calculate the sum of visit counts of all profiles for a specific userID
router.get('/:userID', authenticate, (req, res) => {
    // Get the userID from the request parameters
    const userID = req.params.userID;
    console.log('User ID:', userID);

  
    // Retrieve the sum of visit counts for the specific userID from the database
    const sumVisitCountsQuery = 'SELECT SUM(Visitcount) AS totalVisitCount FROM Profile WHERE UserID = ?';
    db.query(sumVisitCountsQuery, [userID], (err, result) => {
      if (err) {
        console.error('Error executing SQL query: ', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
  
      // Extract the total visit count from the query result
      const totalVisitCount = result[0].totalVisitCount;
  
      // If the totalVisitCount is null, return an error response
      if (totalVisitCount === null) {
        console.log('Total Visit Count is null');
  res.status(404).json({ error: 'Visit counts not available' });
  return;
      }
  
      // Send the total visit count as the response
      res.status(200).json({ totalVisitCount });
    });
});

module.exports = router;
