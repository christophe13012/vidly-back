const express = require("express");
var router = express.Router();

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
    id: 2,
    name: "romance"
  }
];

router.get("/", (req, res) => {
  res.send(genres);
});

router.get("/:id", (req, res) => {
  const genre = genres.find(g => g.id == req.params.id);
  if (!genre) return res.status(404).send("Ce genre n'existe pas");
  res.send(genre);
});

router.post("/genres", (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = {
    id: genres.length + 1,
    name: req.body.name
  };
  genres.push(genre);
  res.send(genre);
});

router.put("/:id", (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = genres.find(g => g.id == req.params.id);
  if (!genre) return res.status(404).send("Ce genre n'existe pas");

  genre.name = req.body.name;
  const index = genres.findIndex(g => g.name == req.body.name);
  genres[index] = genre;
  res.send(genre);
  actio;
});

router.delete("/:id", (req, res) => {
  const index = genres.findIndex(g => g.id == req.params.id);
  if (!index) return res.status(404).send("Ce genre n'existe pas");
  genres.splice(index, 1);
  res.send(genres);
});

module.exports = router;
