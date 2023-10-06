const express = require('express');
const db = require('../services/db');

const router = express.Router();

// PUT route to update company admin user data
router.put('/:CompanyAdminID', (req, res) => {
  const { CompanyAdminID } = req.params;
  const updatedUserData = req.body; // Assuming you send the updated user data in the request body

  // Implement the logic to update the user data in the database
  const updateQuery = 'UPDATE companyadmin SET ? WHERE CompanyAdminID = ?';

  db.query(updateQuery, [updatedUserData, CompanyAdminID], (err, result) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    if (result.affectedRows === 0) {
      // No rows were updated, indicating that the user with the provided ID was not found
      res.status(404).json({ error: 'User not found' });
    } else {
      // User data updated successfully
      res.json({ message: 'User data updated successfully' });
    }
  });
});

module.exports = router;
