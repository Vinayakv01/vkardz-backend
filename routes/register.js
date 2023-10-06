const express = require('express');
const router = express.Router();
const db = require('../services/db');
const multer = require('multer');
const path = require('path');
const authenticate = require('./auth');
const fs = require('fs');
const mime = require('mime');
const bcrypt = require('bcrypt');

// Set up storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Specify the directory to save the uploaded files
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname;
    const extension = path.extname(fileName);
    const uniqueFileName = Date.now() + extension; // Generate a unique filename
    cb(null, uniqueFileName); // Save the file with the generated unique filename
  }
});

// Set up multer upload middleware
const upload = multer({ storage });

// Registration route with file upload
router.post('/', upload.single('userimage'), (req, res) => {
  // Extract data from the request body
  const { name, username, email, phone, password } = req.body;
  
  
  // Check if a file was uploaded
  let filename = '';
  if (req.file) {
    filename = req.file.filename;
    // Debugging: Print the filename
    console.log('Uploaded file:', filename);
  }

  // Check if the username is unique before inserting the user data
  const checkUsernameQuery = 'SELECT COUNT(*) AS count FROM users WHERE Username = ?';
  db.query(checkUsernameQuery, [username], (err, result) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    // If the username already exists, return an error response
    if (result[0].count > 0) {
      res.status(400).json({ error: 'Username is already in use. Please choose a different username.' });
      return;
    }

    // Check if the email is unique before inserting the user data
    const checkEmailQuery = 'SELECT COUNT(*) AS count FROM users WHERE Email = ?';
    db.query(checkEmailQuery, [email], (err, result) => {
      if (err) {
        console.error('Error executing SQL query:', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }

      // If the email already exists, return an error response
      if (result[0].count > 0) {
        res.status(400).json({ error: 'Email is already in use. Please use a different email.' });
        return;
      }

      // Generate a random alphanumeric UserID
      const userID = generateRandomAlphanumeric(10); // Specify the desired length of the UserID

      

      // Insert the user data into the database
      const insertQuery = 'INSERT INTO users (UserID, Name, Username, Email, Phone, Password, Userimage) VALUES (?, ?, ?, ?, ?, ?, ?)';
      db.query(insertQuery, [userID, name, username, email, phone, password, filename], (err, result) => {
        if (err) {
          console.error('Error executing SQL query: ', err);
          res.status(500).json({ error: 'Internal server error' });
          return;
        }

        res.status(201).json({ message: 'User registered successfully', userID });
      });
    });
  });
});

// Function to generate a random alphanumeric string
function generateRandomAlphanumeric(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}


//(api/update)
router.put('/:userID', authenticate, upload.single('userimage'), (req, res) => {
  const userID = req.params.userID;

  // Check if a file was uploaded
  let filename = '';
  if (req.file) {
    filename = req.file.filename;
  }

  const updateQuery = 'UPDATE users SET Userimage = ? WHERE UserID = ?';
  db.query(updateQuery, [filename, userID], (err, result) => {
    if (err) {
      console.error('Error updating user image:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    res.status(200).json({ message: 'User image updated successfully' });
  });
});


router.get('/:userID', authenticate, (req, res) => {
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
    console.log('Retrieved userImageFileName:', userImageFileName); // Add this line for debugging
    const imageURL = `http://localhost:3000/uploads/${userImageFileName}`;
    res.status(200).json({ imageURL });
  });
});


//fetch register user data












// Add this route to register.js to get user table data all data
router.get('/admin/getallusers',authenticate, (req, res) => {
  // Specify the columns you want to select, excluding userimage
  const query = 'SELECT UserID, Name, Username, Email, Phone, Password FROM users';
  db.query(query, (err, result) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json(result);
  });
});





//to update the userdata
router.put('/admin/:userID',authenticate, (req, res) => {
  const userID = req.params.userID;
  const { Name, Username, Email, Phone, Password } = req.body;

  console.log('Updating user data for UserID:', userID);
  console.log('Received data from frontend:', req.body); // Add this log

  // Implement the logic to update the user's data in the database
  const updateQuery = 'UPDATE users SET Name = ?, Username = ?, Email = ?, Phone = ?, Password = ? WHERE UserID = ?';
  console.log('SQL Query:', updateQuery);

  db.query(updateQuery, [Name, Username, Email, Phone, Password, userID], (err, result) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    console.log('User data updated in the database');
    res.json({ message: 'User data updated successfully' });
  });
});




//full user delete along with profile and customfield
router.delete('/admin/:userID',authenticate, async (req, res) => {
  const userID = req.params.userID;

  try {
    // Delete dependent records first (e.g., customfield)
    await deleteDependentRecords(userID);

    // Delete user profile
    await deleteUserProfile(userID);

    // Delete user
    await deleteUser(userID);

    res.status(204).send(); // Successful deletion
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

async function deleteDependentRecords(userID) {
  const deleteQuery = 'DELETE FROM customfield WHERE UserID = ?';
  return new Promise((resolve, reject) => {
    db.query(deleteQuery, [userID], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

async function deleteUserProfile(userID) {
  const deleteQuery = 'DELETE FROM profile WHERE UserID = ?';
  return new Promise((resolve, reject) => {
    db.query(deleteQuery, [userID], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

async function deleteUser(userID) {
  const deleteQuery = 'DELETE FROM users WHERE UserID = ?';
  return new Promise((resolve, reject) => {
    db.query(deleteQuery, [userID], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}






// Add this route to register.js to add a new user
router.post('/admin/adduser',authenticate, (req, res) => {
  const { name, username, email, phone, password } = req.body;

  // Implement the logic to add a new user to the database
  const insertQuery = 'INSERT INTO users (UserID, Name, Username, Email, Phone, Password) VALUES (?, ?, ?, ?, ?, ?)';
  const userID = generateRandomAlphanumeric(10); // Generate a new UserID
  db.query(insertQuery, [userID, name, username, email, phone, password], (err, result) => {
    if (err) {
      console.error('Error executing SQL query: ', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    res.status(201).json({ message: 'User added successfully', userID });
  });
});




//csv data update
router.post('/admin/addusersfromcsv',authenticate, (req, res) => {
  const { csvData } = req.body;

    if (!Array.isArray(csvData)) {
      return res.status(400).json({ error: 'Invalid CSV data format' });
    }

    const addedUsers = [];

    for (const user of csvData) {
      const { name, username, email, phone, password } = user;
      const userID = generateRandomAlphanumeric(10); // Generate a new UserID

      // Insert the user data into the database
      const insertQuery = 'INSERT INTO users (UserID, Name, Username, Email, Phone, Password) VALUES (?, ?, ?, ?, ?, ?)';
      db.query(insertQuery, [userID, name, username, email, phone, password], (err, result) => {
        if (err) {
          console.error('Error executing SQL query: ', err);
        } else {
          addedUsers.push({ userID, name, username });
        }
      });
    }

    res.status(201).json({ message: 'Users added from CSV successfully' });
});

module.exports = router;


