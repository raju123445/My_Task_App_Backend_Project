const Joi = require('joi');

const createPostValidation = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  content: Joi.string().min(1).max(1000).required(),
  category: Joi.string().valid('work', 'personal', 'other').required(),
  isCompleted: Joi.boolean()
});

const updatePostValidation = Joi.object({
  title: Joi.string().min(3).max(100),
  content: Joi.string().min(1).max(1000),
  category: Joi.string().valid('work', 'personal', 'other'),
  isCompleted: Joi.boolean()
}).min(1); // At least one field must be present

module.exports = {
  createPostValidation,
  updatePostValidation
};