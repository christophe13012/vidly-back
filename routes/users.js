const express = require("express");
var router = express.Router();
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Schema = mongoose.Schema;
const userSchema = new Schema({
  email: { type: String, required: true, minlength: 3, maxlength: 50 },
  password: { type: String, required: true, minlength: 3, maxlength: 100 },
  name: { type: String, required: true, minlength: 3, maxlength: 30 }
});
const User = mongoose.model("User", userSchema);

router.get("/", async (req, res) => {
  const users = await User.find().sort("name");
  res.send(users);
});

router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("Cet email est déjà enregistré");
  user = new User();
  user.email = req.body.email;
  user.password = await bcrypt.hash(req.body.password, 10);
  user.name = req.body.name;
  await user.save();
  const token = jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      password: user.password
    },
    "vidly_jwtPrivateKey"
  );
  user = user.toObject();
  delete user.password;
  delete user.__v;
  res.header("x-auth-token", token).send(user);
});

function validateUser(obj) {
  const schema = Joi.object().keys({
    email: Joi.string()
      .email({ minDomainSegments: 2 })
      .min(3)
      .max(50)
      .required(),
    password: Joi.string()
      .min(3)
      .max(50)
      .required(),
    name: Joi.string()
      .min(3)
      .max(30)
      .required()
  });

  const result = Joi.validate(obj, schema);
  return result;
}

module.exports.users = router;
module.exports.User = User;
module.exports.userSchema = userSchema;
