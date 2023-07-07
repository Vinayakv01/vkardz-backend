const express = require('express');
const app = express();
const routes = require('../routes');

const port = 3000; // Specify your desired port number

// Configure routes
app.use('/api', routes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
