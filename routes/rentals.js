const express = require("express");
var router = express.Router();
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");
const { Movie } = require("./movies");
const { User } = require("./users");
const { genreSchema, Genre } = require("./genres");

const rentalSchema = new mongoose.Schema({
  user: {
    type: new mongoose.Schema({
      email: { type: String, required: true, minlength: 3, maxlength: 50 },
      name: { type: String, required: true, minlength: 3, maxlength: 30 }
    }),
    required: true
  },
  movie: {
    type: new mongoose.Schema({
      title: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 255
      },
      dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255
      },
      genre: { type: genreSchema, required: true }
    }),
    required: true
  },
  dateOut: {
    type: Date,
    required: true,
    default: Date.now
  },
  dateReturned: {
    type: Date
  },
  rentalFee: {
    type: Number,
    min: 0
  }
});

const Rental = mongoose.model("Rental", rentalSchema);

router.get("/", async (req, res) => {
  const rentals = await Rental.find();
  res.send(rentals);
});

router.get("/:id", async (req, res) => {
  const rental = await Rental.findById(req.params.id);
  if (!rental) return res.status(400).send("Cette location n'existe pas");
  res.send(rental);
});

router.post("/", async (req, res) => {
  const { error } = validateRental(req.body);
  if (error) return res.status(404).send(error.details[0].message);
  const user = await User.findById(req.body.userId);
  if (!user) return res.status(404).send("Cet utilisateur n'existe pas");
  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(404).send("Ce film n'existe pas");
  movie.numberInStock = movie.numberInStock - 1;
  await movie.save();
  const movieInDb = await Movie.findOneAndUpdate(
    { _id: req.body.movieId },
    { numberInStock: movie.numberInStock },
    {
      new: true
    }
  );
  const rental = new Rental();
  rental.user = user;
  rental.movie = movieInDb;
  await rental.save();
  res.send(movieInDb);
});

function validateRental(rental) {
  const schema = {
    userId: Joi.objectId().required(),
    movieId: Joi.objectId().required()
  };

  return Joi.validate(rental, schema);
}

module.exports = router;
