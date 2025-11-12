const Joi = require('joi');

const registerValidation = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

const loginValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

const updateProfileValidation = Joi.object({
  name: Joi.string().min(3).max(50),
  email: Joi.string().email(),
  bio: Joi.string().max(250),
  password: Joi.string().min(6)
}).min(1); // At least one field must be present

module.exports = {
  registerValidation,
  loginValidation,
  updateProfileValidation
};