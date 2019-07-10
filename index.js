const express = require("express");
const app = express();
const genres = require("./routes/genres");
const customers = require("./routes/customers");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/vidly", { useNewUrlParser: true });

app.use(express.json());
app.use("/api/genres", genres);
app.use("/api/customers", customers);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("listening on port " + port);
});
