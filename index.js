const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("express-async-errors");
const { genres } = require("./routes/genres");
const { customers } = require("./routes/customers");
const { movies } = require("./routes/movies");
const rentals = require("./routes/rentals");

mongoose.connect("mongodb://localhost/vidly", () => {
  console.log("Connected to db");
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(express.json());
app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("listening on port " + port);
});
