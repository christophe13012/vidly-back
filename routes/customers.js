const express = require("express");
var router = express.Router();
const Joi = require("joi");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const customerSchema = new Schema({
  isGold: { type: Boolean, required: true },
  name: { type: String, required: true, minlength: 5, maxlength: 50 },
  phone: { type: String, required: true, minlength: 5, maxlength: 255 }
});
const Customer = mongoose.model("Customer", customerSchema);

router.get("/", async (req, res) => {
  const customers = await Customer.find().sort("name");
  res.send(customers);
});

/*
router.get("/:id", async (req, res) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre) return res.status(404).send("Ce genre n'existe pas");
  res.send(genre);
});

router.post("/", async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let genre = await Genre.findOne({ name: req.body.name });
  if (genre) return res.status(400).send("Ce genre existe deja");
  genre = new Genre();
  genre.name = req.body.name;
  await genre.save();
  res.send(genre);
});

router.put("/:id", async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let genre = await Genre.findOne({ name: req.body.name });
  if (genre)
    return res
      .status(400)
      .send("Le genre n'est pas modifié ou existe déjà dans notre bd");

  genre = await Genre.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  );
  if (!genre) return res.status(404).send("Ce genre n'existe pas");
  res.send(genre);
});

router.delete("/:id", async (req, res) => {
  const genre = await Genre.findByIdAndDelete(req.params.id);
  if (!genre) return res.status(404).send("Ce genre n'existe pas");
  res.send(genre);
});
*/

function validateCustomers(obj) {
  const schema = Joi.object().keys({
    name: Joi.string()
      .min(3)
      .max(30)
      .required()
  });

  const result = Joi.validate(obj, schema);
  return result;
}

module.exports = router;
