// api/public/user/:userID
const express = require('express');
const db = require('../services/db');


const router = express.Router();

router.get('/:userID', (req, res) => {
    const userID = req.params.userID;
  
    // Retrieve the user image filename from the database
    const getImageQuery = 'SELECT Userimage FROM users WHERE UserID = ?';
    db.query(getImageQuery, [userID], (err, result) => {
      if (err) {
        console.error('Error getting user image:', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
  
      if (result.length === 0 || !result[0].Userimage) {
        // Return a default image or appropriate response if the user or image is not found
        res.status(404).json({ error: 'User image not found' });
        return;
      }
  
      const userImageFileName = result[0].Userimage;
      const imageURL = `http://192.168.1.14:3000/uploads/${userImageFileName}`; // Update with your server URL
      res.status(200).json({ imageURL }); // Redirect the user to the image URL
    });
  });
  

  module.exports = router;
