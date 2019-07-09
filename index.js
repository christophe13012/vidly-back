const express = require("express");
const app = express();
const bodyParser = require("body-parser");

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

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/api/genres", (req, res) => {
  res.send(genres);
});

app.get("/api/genres/:id", (req, res) => {
  const genre = genres.find(g => g.id == req.params.id);
  res.send(genre);
});

app.post("/api/genres", (req, res) => {
  const genre = {
    id: genres.length + 1,
    name: req.body.name
  };
  genres.push(genre);
  res.send(genre);
});

app.put("/api/genres", (req, res) => {
  const genre = genres.find(g => g.id === req.body.id);
  genre.name = req.body.name;
  const index = genres.findIndex(g => g.name === req.body.name);
  genres[index] = genre;
  res.send(genre);
});

app.delete("/api/genres", (req, res) => {
  const index = genres.findIndex(g => g.id === req.body.id);
  genres.splice(index, 1);
  res.send(genres);
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("listening on port " + port);
});
