const express = require('express');
const db = require('../services/db');

const router = express.Router();

// DELETE route to delete a company admin by CompanyAdminID
router.delete('/:CompanyAdminID', (req, res) => {
  const { CompanyAdminID } = req.params;

  // Define the SQL query to delete the company admin by CompanyAdminID
  const deleteQuery = 'DELETE FROM companyadmin WHERE CompanyAdminID = ?';

  // Execute the SQL query
  db.query(deleteQuery, [CompanyAdminID], (err, result) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    if (result.affectedRows === 0) {
      // No rows were deleted, indicating that the user with the given CompanyAdminID doesn't exist
      res.status(404).json({ error: 'Company admin not found' });
      return;
    }

    // Company admin deleted successfully
    res.json({ message: 'Company admin deleted successfully' });
  });
});

module.exports = router;