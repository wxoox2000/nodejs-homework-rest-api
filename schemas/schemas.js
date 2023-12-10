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
});

const favoriteContactSchema = Joi.object({
  favorite: Joi.boolean().required().messages({
    "any.required": "missing field favorite",
  })
})

const verifySchema = Joi.object({
  email: Joi.string().required().messages({
    "any.required": "missing required field email",
  })
})

// password: {
//   type: String,
//   required: [true, "Set password for user"],
// },
// email: {
//   type: String,
//   required: [true, "Email is required"],
//   unique: true,
// },
// subscription: {
//   type: String,
//   enum: ["starter", "pro", "business"],
//   default: "starter",
// },
// token: String,


const userSignupSchema = Joi.object({
  password: Joi.string().required(),
  email: Joi.string().required(),
  subscription: Joi.string().valid("starter", "pro", "business"),
  // token: Joi.string(),
});
const userSigninSchema = Joi.object({
  password: Joi.string().required(),
  email: Joi.string().required(),
});

module.exports = {
    addContactSchema,
    updateContactSchema,
    favoriteContactSchema,
    userSignupSchema,
    userSigninSchema,
    verifySchema
}