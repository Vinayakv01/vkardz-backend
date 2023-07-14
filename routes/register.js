const express = require('express');
const router = express.Router();
const db = require('../services/db');
const multer = require('multer');

// Set up storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Specify the directory to save the uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original filename for saving the file
  }
});

// Set up multer upload middleware
const upload = multer({ storage });

// Registration route with file upload
router.post('/', upload.single('userimage'), (req, res) => {
  // Generate a random alphanumeric UserID
  const userID = generateRandomAlphanumeric(10); // Specify the desired length of the UserID

  // Extract other data from the request body
  const { name, username, email, phone, password } = req.body;

  // Get the uploaded file information
  const userimage = req.file;

  // Debugging: Print the values of req.file and userImage.buffer
  console.log('req.file:', req.file);
  console.log('userImage.buffer:', userimage.buffer);

  // Insert the user data into the database
  const query = 'INSERT INTO Users (UserID, Name, Username, Email, Phone, Password, Userimage) VALUES (?, ?, ?, ?, ?, ?, ?)';
  db.query(query, [userID, name, username, email, phone, password, userimage.buffer], (err, result) => {
    if (err) {
      console.error('Error executing SQL query: ', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    res.status(201).json({ message: 'User registered successfully', userID });
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

module.exports = router;

