const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("express-async-errors");
const { genres } = require("./routes/genres");
const { customers } = require("./routes/customers");
const { users } = require("./routes/users");
const { movies } = require("./routes/movies");
const rentals = require("./routes/rentals");

const passwordDb = process.env.PASSWORD_DB;

mongoose.connect(
  "mongodb+srv://christest:" +
    passwordDb +
    "@vidly-qu0jp.gcp.mongodb.net/vidly",
  () => {
    console.log("Connected to db");
  }
);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET,HEAD,OPTIONS,POST,PUT,DELETE"
  );
  next();
});

app.use(express.json());
app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/users", users);
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("listening on port " + port);
});
