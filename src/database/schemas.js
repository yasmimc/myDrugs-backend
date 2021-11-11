import Joi from "joi";

const productSoldSchema = Joi.object({
    productId: Joi.number().required(),
    amount: Joi.number().required()
})

export const checkoutSchema = Joi.object({
    userId: Joi.number().required(),
    name: Joi.string().required(),
    email: Joi.string().email({ tlds: { allow: false } }).required(),
    cep: Joi.string().min(8).max(8).required(),
    addressNumber: Joi.number().required(),
    products: Joi.array().items(productSoldSchema).required()
})