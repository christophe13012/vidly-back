const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("express-async-errors");
const { genres } = require("./routes/genres");
const customers = require("./routes/customers");
const movies = require("./routes/movies");

mongoose.connect("mongodb://localhost/vidly", { useNewUrlParser: true }, () => {
  console.log("Connected to db");
});

app.use(express.json());
app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/movies", movies);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("listening on port " + port);
});
