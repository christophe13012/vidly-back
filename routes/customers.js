const express = require("express");
var router = express.Router();
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
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

router.get("/:id", async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) return res.status(404).send("Cet utilisateur n'existe pas");
  res.send(customer);
});

router.post("/", async (req, res) => {
  const { error } = validateCustomers(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let customer = await Genre.findOne({ name: req.body.name });
  if (customer) return res.status(400).send("Ce nom existe déjà");
  customer = new Genre();
  customer.name = req.body.name;
  customer.isGold = req.body.isGold;
  customer.phone = req.body.phone;
  await customer.save();
  res.send(customer);
});

router.put("/:id", async (req, res) => {
  const { error } = validateCustomers(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    { isGold: req.body.isGold, name: req.body.name, phone: req.body.phone },
    { new: true }
  );
  if (!customer) return res.status(404).send("Cet utilisateur n'existe pas");
  res.send(customer);
});

router.delete("/:id", async (req, res) => {
  const customer = await Customer.findByIdAndDelete(req.params.id);
  if (!customer) return res.status(404).send("Cet utilisateur n'existe pas");
  res.send(customer);
});

function validateCustomers(obj) {
  const schema = Joi.object().keys({
    _id: Joi.objectId(),
    isGold: Joi.boolean().required(),
    name: Joi.string()
      .min(5)
      .max(50)
      .required(),
    phone: Joi.string()
      .min(5)
      .max(255)
      .required()
  });

  const result = Joi.validate(obj, schema);
  return result;
}

module.exports = router;
