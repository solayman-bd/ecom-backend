import Joi from 'joi';
import mongoose from 'mongoose';

export const orderRequestValidatorSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.base': 'Email must be a string',
      'string.email': 'Invalid email format',
      'any.required': 'Email is required',
    }),
  productId: Joi.string()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.message({
          custom: '"productId" must be a valid MongoDB ObjectId',
        });
      }
      return value;
    })
    .required()
    .messages({
      'any.required': 'Product ID is required',
    }),
  price: Joi.number().positive().required().messages({
    'number.base': 'Price must be a number',
    'number.positive': 'Price must be a positive number',
    'any.required': 'Price is required',
  }),
  quantity: Joi.number().integer().positive().required().messages({
    'number.base': 'Quantity must be a number',
    'number.integer': 'Quantity must be an integer',
    'number.positive': 'Quantity must be a positive number',
    'any.required': 'Quantity is required',
  }),
});
