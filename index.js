const express = require("express");
require('dotenv').config();
const cors = require('cors');
const db = require('./services/db');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes
const loginRoutes = require('./routes/login');
const registerRoutes = require('./routes/register');

app.use('/api/login', loginRoutes);
app.use('/api/register', registerRoutes);

// Default route
app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

// Start the server
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
