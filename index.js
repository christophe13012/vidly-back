const express = require("express");
const app = express();

const genres = [
  {
    id: 0,
    name: "horror"
  },
  {
    id: 1,
    name: "action"
  },
  {
    id: 0,
    name: "romance"
  }
];

app.get("/api/genres", function(req, res) {
  res.send(genres);
});

app.listen(3000);
