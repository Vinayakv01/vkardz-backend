const express = require("express");
require('dotenv').config()
const db = require('./services/db');
const app = express();
const port = process.env.PORT;
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.get("/", (req, res) => {
  res.json({ message: "ok" });
});
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});