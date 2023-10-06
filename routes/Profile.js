const express = require('express');
const db = require('../services/db');
const authenticate = require('./auth');


const router = express.Router();


// Route to save the profile data
router.post('/',authenticate, (req, res) => {
  // Get the authenticated user's ID from the request
  const userID = req.userID;
    console.log('Authenticated UserID:', userID);

  console.log('UserID:', userID); // Log the userID to check if it's retrieved correctly

  // Extract the profile data from the request body
  const { profileName, designation, companyName, profileImage, website, address, mobile, email } = req.body;

  // Insert the profile data into the Profile table
  const insertProfileQuery = 'INSERT INTO Profile (UserID, ProfileName, Designation, CompanyName, ProfileImage, Website, Address, Mobile, Email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
  db.query(insertProfileQuery, [userID, profileName, designation, companyName, profileImage, website, address, mobile, email], (err, result) => {
    if (err) {
      console.error('Error executing SQL query: ', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    // Get the auto-generated ProfileID for the newly inserted profile
    const profileID = result.insertId;

    console.log('Inserted ProfileID:', profileID); // Log the inserted profileID to check if it's generated correctly

    // Insert custom field data (if available) into the CustomField table
    if (req.body.customFields && Array.isArray(req.body.customFields)) {
      const customFields = req.body.customFields;
      const insertCustomFieldQuery = 'INSERT INTO CustomField (UserID, ProfileID, FieldName, Value) VALUES (?, ?, ?, ?)';
      customFields.forEach((field) => {
        db.query(insertCustomFieldQuery, [userID, profileID, field.fieldName, field.value], (err, result) => {
          if (err) {
            console.error('Error executing SQL query: ', err);
            res.status(500).json({ error: 'Internal server error' });
            return;
          }

          console.log('Inserted CustomFieldID:', result.insertId); // Log the inserted CustomFieldID to check if it's generated correctly
        });
      });
    }

    res.status(201).json({ message: 'Profile data saved successfully', profileID });
  });
});



//selecrted Profile (get user profile based on userID (array of profiles))
router.get('/', authenticate, (req, res) => {
  // Get the authenticated user's ID from the request
  const userID = req.userID;

  // Retrieve all profiles associated with the user from the database
  const getProfilesQuery = 'SELECT * FROM Profile WHERE UserID = ?';
  db.query(getProfilesQuery, [userID], (err, profileResults) => {
    if (err) {
      console.error('Error executing SQL query: ', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    // Check if the user has any profiles
    if (profileResults.length === 0) {
      res.status(404).json({ error: 'Profiles not found' });
      return;
    }

    // Iterate through the profiles to retrieve their custom fields
    const profilesWithCustomFields = [];
    profileResults.forEach((profile) => {
      const profileID = profile.ProfileID;
      const getCustomFieldsQuery = 'SELECT * FROM CustomField WHERE UserID = ? AND ProfileID = ?';
      db.query(getCustomFieldsQuery, [userID, profileID], (err, customFieldsResults) => {
        if (err) {
          console.error('Error executing SQL query: ', err);
          res.status(500).json({ error: 'Internal server error' });
          return;
        }

        // Construct the user's profile object with custom fields and IsDefaultProfile
        const userProfile = {
          profileID: profile.ProfileID,
          profileName: profile.ProfileName,
          designation: profile.Designation,
          companyName: profile.CompanyName,
          profileImage: profile.ProfileImage,
          website: profile.Website,
          address: profile.Address,
          mobile: profile.Mobile,
          email: profile.Email,
          customFields: customFieldsResults,
          IsDefaultProfile: profile.IsDefaultProfile,
          Visitcount: profile.Visitcount,
          // Add the IsDefaultProfile field
        };

        // Add the profile to the list of profiles with custom fields
        profilesWithCustomFields.push(userProfile);

        // If all profiles have been processed, send the response
        if (profilesWithCustomFields.length === profileResults.length) {
          res.status(200).json(profilesWithCustomFields);
        }
      });
    });
  });
});




// Route to get the user's profile
router.get('/:profileID', authenticate, (req, res) => {
  // Get the authenticated user's ID from the request
  const userID = req.userID;
  const profileID = req.params.profileID;
 
  console.log('userID:', userID);
  console.log('profileID:', profileID);

  // Retrieve the user's profile from the database
  const getProfileQuery = 'SELECT * FROM Profile WHERE UserID = ? AND ProfileID = ?';
  db.query(getProfileQuery, [userID, profileID], (err, profileResults) => {
    if (err) {
      console.error('Error executing SQL query: ', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    // Check if the user has a profile
    if (profileResults.length === 0) {
      res.status(404).json({ error: 'Profile not found' });
      return;
    }

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
        isDefaultProfile: profileResults[0].IsDefaultProfile === 1, // Convert to boolean // Include the IsDefaultProfile field
        customFields: customFieldsResults,
      };

      // Send the user's profile as a response
      res.status(200).json(userProfile);
    });
  });
});



// Route to get the user's default profile
router.get('/:userID', (req, res) => {
  const userID = req.params.userID;

  // Retrieve the user's default profile from the database
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
        customFields: customFieldsResults,
      };

      // Send the user's profile as a response
      res.status(200).json(userProfile);
    });
  });
});





// Route to update the user's profile's IsDefaultProfile value
router.put('/update-default/:profileID', authenticate, (req, res) => {
  const userID = req.userID;
  const profileID = req.params.profileID;

  // Extract updated IsDefaultProfile value from the request body
  const { isDefaultProfile } = req.body;

  // Update the IsDefaultProfile value in the Profile table
  const updateIsDefaultProfileQuery =
    'UPDATE Profile SET IsDefaultProfile = ? WHERE UserID = ? AND ProfileID = ?';

  db.query(
    updateIsDefaultProfileQuery,
    [isDefaultProfile, userID, profileID],
    (err, updateResult) => {
      if (err) {
        console.error('Error executing SQL query: ', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }

      if (updateResult.affectedRows === 0) {
        res.status(404).json({ error: 'Profile not found' });
        return;
      }

      res.status(200).json({ message: 'IsDefaultProfile updated successfully' });
    }
  );
});



// Route to update the user's profile including customfields
router.put('/:profileID', authenticate, (req, res) => {
  const userID = req.userID;
  const profileID = req.params.profileID;

  // Extract the updated profile data from the request body
  const {
    profileName,
    designation,
    companyName,
    profileImage,
    website,
    address,
    mobile,
    email,
    customFields,
    isDefaultProfile // New field for IsDefaultProfile
  } = req.body;

  // Update the profile data in the database for the specified profileID
  const updateProfileQuery =
    'UPDATE Profile SET ProfileName = ?, Designation = ?, CompanyName = ?, ProfileImage = ?, Website = ?, Address = ?, Mobile = ?, Email = ?, IsDefaultProfile = ? WHERE UserID = ? AND ProfileID = ?';
  db.query(
    updateProfileQuery,
    [
      profileName,
      designation,
      companyName,
      profileImage,
      website,
      address,
      mobile,
      email,
      isDefaultProfile, // Set the IsDefaultProfile field
      userID,
      profileID
    ],
    (err, result) => {
      if (err) {
        console.error('Error executing SQL query: ', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }

      // Update the custom fields associated with the profile
    // Update the custom fields associated with the profile
    if (customFields && Array.isArray(customFields)) {
      customFields.forEach((field) => {
        if (field.customFieldID) {
          // Update existing custom field
          const updateCustomFieldQuery =
            'UPDATE CustomField SET Value = ? WHERE UserID = ? AND ProfileID = ? AND CustomFieldID = ?';
          db.query(
            updateCustomFieldQuery,
            [field.Value, userID, profileID, field.customFieldID],
            (err, result) => {
              // handle update result
            }
          );
        } else {
          // Create new custom field
          const insertCustomFieldQuery =
            'INSERT INTO CustomField (UserID, ProfileID, FieldName, Value) VALUES (?, ?, ?, ?)';
          db.query(
            insertCustomFieldQuery,
            [userID, profileID, field.FieldName, field.Value],
            (err, result) => {
              // handle insert result
            }
          );
        }
      });
    }

      res.status(200).json({ message: 'Profile data and custom fields updated successfully' });
    }
  );
});



// Route to delete a custom field
router.delete('/custom-field/:customFieldID', authenticate, (req, res) => {
  const userID = req.userID;
  const customFieldID = req.params.customFieldID;

  // Delete the custom field
  const deleteCustomFieldQuery = 'DELETE FROM CustomField WHERE UserID = ? AND CustomFieldID = ?';
  db.query(deleteCustomFieldQuery, [userID, customFieldID], (err, deleteResult) => {
    if (err) {
      console.error('Error executing SQL query: ', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    if (deleteResult.affectedRows === 0) {
      res.status(404).json({ error: 'Custom field not found' });
      return;
    }

    res.status(200).json({ message: 'Custom field deleted successfully' });
  });
});





// Route to delete a profile
router.delete('/:profileID', authenticate, (req, res) => {
  const userID = req.userID;
  const profileID = req.params.profileID;

  // Delete associated custom fields
  const deleteCustomFieldsQuery = 'DELETE FROM CustomField WHERE ProfileID = ?';
  db.query(deleteCustomFieldsQuery, [profileID], (err, deleteCustomFieldsResult) => {
    if (err) {
      console.error('Error executing SQL query: ', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    // After deleting custom fields, delete the profile
    const deleteProfileQuery = 'DELETE FROM Profile WHERE ProfileID = ? AND UserID = ?';
    db.query(deleteProfileQuery, [profileID, userID], (err, deleteProfileResult) => {
      if (err) {
        console.error('Error executing SQL query: ', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }

      if (deleteProfileResult.affectedRows === 0) {
        res.status(404).json({ error: 'Profile not found' });
        return;
      }

      res.status(200).json({ message: 'Profile and associated custom fields deleted successfully' });
    });
  });
});






module.exports = router;