import joi from "joi";
import { emailRegex, cpfRegex, strongPasswordRegex } from "./regex.js";

const usersSchema = joi.object({
	name: joi.string().min(3).required(),
	email: joi.string().pattern(new RegExp(emailRegex)).required(),
	cpf: joi.string().min(11).max(11).pattern(new RegExp(cpfRegex)).required(),
	password: joi.string().pattern(new RegExp(strongPasswordRegex)).required(),
});

const cartIncrementBodySchema = joi.object({
	cartId: joi.number().required(),
	productId: joi.number().required(),
	amount: joi.number().required(),
})

const checkoutSchema = joi.object({
    userId: joi.number().required(),
    paymentId: joi.number().required(),
    cartId: joi.number().required(),
    name: joi.string().required(),
    email: joi.string().email({ tlds: { allow: false } }).required(),
    cep: joi.string().min(8).max(8).required(),
    addressNumber: joi.number().required(),
})

export {
	usersSchema,
	cartIncrementBodySchema,
	checkoutSchema
};
