const express = require("express");
var router = express.Router();
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");
const { genreSchema, Genre } = require("./genres");

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true, minLength: 1, maxLength: 30 },
  genre: { type: genreSchema, required: true },
  numberInStock: { type: Number, min: 0, max: 500 },
  dailyRentalRate: { type: Number, min: 0, max: 10 }
});

const Movie = mongoose.model("Movie", movieSchema);

router.get("/", async (req, res) => {
  const movies = await Movie.find().sort("title");
  res.send(movies);
});

router.get("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(404).send("Ce film n'existe pas");
  const movie = await Movie.findById(req.params.id);
  if (!movie) return res.status(404).send("Ce film n'existe pas");
  res.send(movie);
});

router.post("/", async (req, res) => {
  const { error } = validateMovie(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Ce genre n'existe pas");

  let movie = new Movie();
  movie.title = req.body.title;
  movie.genre = genre;
  movie.numberInStock = req.body.numberInStock;
  movie.dailyRentalRate = req.body.dailyRentalRate;
  await movie.save();
  res.send(movie);
});

router.put("/:id", async (req, res) => {
  const bodyNoId = { ...req.body };
  delete bodyNoId._id;
  const { error } = validateMovie(bodyNoId);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(404).send("Ce genre n'existe pas");

  const movie = await Movie.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate
    },
    { new: true }
  );

  res.send(movie);
});

router.delete("/:id", async (req, res) => {
  const movie = await Movie.findByIdAndDelete(req.params.id);
  if (!movie) return res.status(404).send("Ce film n'existe pas");
  res.send(movie);
});

function validateMovie(obj) {
  const schema = Joi.object().keys({
    title: Joi.string()
      .min(1)
      .max(30)
      .required(),
    genreId: Joi.objectId().required(),
    numberInStock: Joi.number()
      .min(0)
      .max(500)
      .required(),
    dailyRentalRate: Joi.number()
      .min(0)
      .max(10)
      .required()
  });

  const result = Joi.validate(obj, schema);
  return result;
}

module.exports.movies = router;
module.exports.Movie = Movie;
