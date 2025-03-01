const { validate, Joi } = require('express-validation');
const { ProductTypes } = require('../../common/product/product.enum');

const colorSchema = Joi.object({
 name: Joi.string().required(),
 code: Joi.string().required(),
 price: Joi.number().min(0).required(),
 discount: Joi.number().min(0).optional().allow(null),
 active_discount: Joi.boolean().optional().allow(null),
 count: Joi.number().min(0).required(),
});

const sizeSchema = Joi.object({
 size: Joi.string().required(),
 price: Joi.number().min(0).required(),
 discount: Joi.number().min(0).optional().allow(null),
 active_discount: Joi.boolean().optional().allow(null),
 count: Joi.number().min(0).required(),
});

const createProductValidation = validate({
 body: Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  type: Joi.string()
   .valid(...Object.values(ProductTypes))
   .required(),
  price: Joi.number().min(0).optional().allow(null).default(0),
  discount: Joi.number().min(0).optional().allow(null).default(0),
  active_discount: Joi.boolean().optional().allow(null),
  count: Joi.number().min(0).optional().allow(null).default(1),
  details: Joi.array()
   .items(
    Joi.object({
     key: Joi.string().required(),
     value: Joi.string().required(),
    })
   )
   .min(1)
   .optional()
   .default([]),
  colors: Joi.when('type', {
   is: ProductTypes.Colored,
   then: Joi.array().items(colorSchema).required(),
   otherwise: Joi.forbidden(),
  }),
  sizes: Joi.when('type', {
   is: ProductTypes.Sized,
   then: Joi.array().items(sizeSchema).required(),
   otherwise: Joi.forbidden(),
  }),
 }),
});

module.exports = {
 createProductValidation,
};
