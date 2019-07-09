const express = require("express");
const app = express();
const Joi = require("joi");
const routes = require("./routes/genres");

app.use(express.json());
app.use("/api/genres", routes);

function validateGenre(obj) {
  const schema = Joi.object().keys({
    name: Joi.string()
      .min(3)
      .max(30)
      .required()
  });

  const result = Joi.validate(obj, schema);
  return result;
}

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("listening on port " + port);
});
