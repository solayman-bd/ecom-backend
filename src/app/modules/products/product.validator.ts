import Joi from 'joi';

const variantSchema = Joi.object({
  type: Joi.string().required().messages({
    'string.base': '"type" should be a type of string',
    'string.empty': '"type" cannot be an empty field',
    'any.required': '"type" is a required field',
  }),
  value: Joi.string().required().messages({
    'string.base': '"value" should be a type of string',
    'string.empty': '"value" cannot be an empty field',
    'any.required': '"value" is a required field',
  }),
});

const inventorySchema = Joi.object({
  quantity: Joi.number().integer().required().messages({
    'number.base': '"quantity" should be a type of number',
    'number.integer': '"quantity" should be an integer',
    'any.required': '"quantity" is a required field',
  }),
  inStock: Joi.boolean().required().messages({
    'boolean.base': '"inStock" should be a type of boolean',
    'any.required': '"inStock" is a required field',
  }),
});

export const productValidationSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.base': '"name" should be a type of string',
    'string.empty': '"name" cannot be an empty field',
    'any.required': '"name" is a required field',
  }),
  description: Joi.string().required().messages({
    'string.base': '"description" should be a type of string',
    'string.empty': '"description" cannot be an empty field',
    'any.required': '"description" is a required field',
  }),
  price: Joi.number().required().messages({
    'number.base': '"price" should be a type of number',
    'any.required': '"price" is a required field',
  }),
  category: Joi.string().required().messages({
    'string.base': '"category" should be a type of string',
    'string.empty': '"category" cannot be an empty field',
    'any.required': '"category" is a required field',
  }),
  tags: Joi.array()
    .items(
      Joi.string().required().messages({
        'string.base': '"tags" should be a type of string',
        'string.empty': '"tags" cannot be an empty field',
        'any.required': '"tags" is a required field',
      }),
    )
    .required()
    .messages({
      'array.base': '"tags" should be an array',
      'any.required': '"tags" is a required field',
    }),
  variants: Joi.array().items(variantSchema).required().messages({
    'array.base': '"variants" should be an array',
    'any.required': '"variants" is a required field',
  }),
  inventory: inventorySchema.required().messages({
    'any.required': '"inventory" is a required field',
  }),
});
