const Joi = require("joi");

const addContactSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "missing required name field",
    "string.base": `name should belong to type "string"`
  }),
  email: Joi.string().required().messages({
    "any.required": "missing required email field",
    "string.base": `email should belong to type "string"`
  }),
  phone: Joi.string().required().messages({
    "any.required": "missing required phone field",
    "string.base": `phone should belong to type "string"`
  }),
});

const updateContactSchema = Joi.object({
    name: Joi.string(),
    email: Joi.string(),
    phone: Joi.string(),
})

module.exports = {
    addContactSchema,
    updateContactSchema,
}