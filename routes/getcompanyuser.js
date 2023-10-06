// routes/users.js

const express = require('express');
const db = require('../services/db');
const authenticate = require('./auth');

const router = express.Router();

// API route to get users by CompanyAdminID
router.get('/CompanyAdmin/:CompanyAdminID', authenticate, (req, res) => {
  const authenticatedCompanyAdminID = req.companyAdminID; // Get authenticated CompanyAdminID

  // Query the database to retrieve users by CompanyAdminID
  const query = 'SELECT * FROM users WHERE CompanyAdminID = ?';

  db.query(query, [authenticatedCompanyAdminID], (err, result) => {
    if (err) {
      console.error('Error executing SQL query: ', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    // Respond with the list of users
    res.json(result);
  });
});







router.delete('/CompanyAdmin/:CompanyAdminID/users/:UserID', async (req, res) => {
  const CompanyAdminID = req.params.CompanyAdminID;
  const UserID = req.params.UserID;

  try {
    // Add logic here to delete custom field records related to the user
    await deleteCustomFields(UserID);

    // Now that custom fields are deleted, you can proceed to delete the user's profile
    await deleteProfile(UserID);

    // After deleting the profile, you can safely delete the user
    const deleteQuery = 'DELETE FROM users WHERE CompanyAdminID = ? AND UserID = ?';

    db.query(deleteQuery, [CompanyAdminID, UserID], (err, result) => {
      if (err) {
        console.error('Error deleting user:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      if (result.affectedRows === 0) {
        // No user with the provided CompanyAdminID and UserID was found
        return res.status(404).json({ error: 'User not found' });
      }

      // User deleted successfully
      return res.status(204).send();
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

async function deleteCustomFields(UserID) {
  // Add logic to delete custom field records related to the user
  const deleteCustomFieldsQuery = 'DELETE FROM customfield WHERE UserID = ?';

  return new Promise((resolve, reject) => {
    db.query(deleteCustomFieldsQuery, [UserID], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

async function deleteProfile(UserID) {
  // Add logic to delete the user's profile
  const deleteProfileQuery = 'DELETE FROM profile WHERE UserID = ?';

  return new Promise((resolve, reject) => {
    db.query(deleteProfileQuery, [UserID], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}







// API route to update a user by UserID and CompanyAdminID without additional checks
router.put('/CompanyAdmin/:CompanyAdminID/users/:UserID/update', (req, res) => {
  const companyAdminID = req.params.CompanyAdminID; // Get CompanyAdminID from URL
  const userID = req.params.UserID; // Get UserID from URL
  const updatedUserData = req.body; // Updated user data from the request body

  // Construct an SQL query to update the user's data
  const query = 'UPDATE users SET Name = ?, Username = ?, Password = ? WHERE UserID = ? AND CompanyAdminID = ?';

  // Execute the SQL query to update the user's data
  db.query(
    query,
    [updatedUserData.Name, updatedUserData.Username, updatedUserData.Password, userID, companyAdminID],
    (err, result) => {
      if (err) {
        console.error('Error executing SQL query: ', err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      if (result.affectedRows === 0) {
        // No user with the provided UserID and CompanyAdminID was found
        return res.status(404).json({ error: 'User not found' });
      }

      // User updated successfully
      return res.json({ message: 'User updated successfully' });
    }
  );
});

  









  function generateRandomAlphanumeric(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }
  
  router.post('/CompanyAdmin/create', authenticate, (req, res) => {
    const authenticatedCompanyAdminID = req.companyAdminID; // Get authenticated CompanyAdminID
    const userData = req.body; // User data from the request body
  
    // Generate a random User ID
    const userID = generateRandomAlphanumeric(10);
  
    // Add the generated User ID and CompanyAdminID to the userData
    userData.UserID = userID;
    userData.CompanyAdminID = authenticatedCompanyAdminID;
  
    // Insert the new user into the database
    const query = 'INSERT INTO users SET ?';
  
    db.query(query, userData, (err, result) => {
      if (err) {
        console.error('Error executing SQL query: ', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
  
      // Respond with the newly created user
      res.status(201).json({
        message: 'User created successfully',
        newUser: {
          UserID: userID, // The generated UserID
          ...userData, // Include all user data provided in the request body
        },
      });
    });
  });
  
  module.exports = router;
  