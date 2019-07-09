const express = require("express");
const app = express();
const Joi = require("joi");

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

const schema = Joi.object().keys({
  name: Joi.string()
    .min(3)
    .max(30)
    .required()
});

app.use(express.json());

app.get("/api/genres", (req, res) => {
  res.send(genres);
});

app.get("/api/genres/:id", (req, res) => {
  const genre = genres.find(g => g.id == req.params.id);
  if (!genre) return res.status(404).send("Ce genre n'existe pas");
  res.send(genre);
});

app.post("/api/genres", (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = {
    id: genres.length + 1,
    name: req.body.name
  };
  genres.push(genre);
  res.send(genre);
});

app.put("/api/genres/:id", (req, res) => {
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

app.delete("/api/genres/:id", (req, res) => {
  const index = genres.findIndex(g => g.id == req.params.id);
  if (!index) return res.status(404).send("Ce genre n'existe pas");
  genres.splice(index, 1);
  res.send(genres);
});

function validateGenre(obj) {
  const result = Joi.validate(obj, schema);
  return result;
}

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("listening on port " + port);
});
