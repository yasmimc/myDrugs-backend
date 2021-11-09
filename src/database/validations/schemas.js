import joi from "joi";
import { emailRegex, cpfRegex, strongPasswordRegex } from "./regex.js";

const usersSchema = joi.object({
	name: joi.string().min(3).required(),
	email: joi.string().pattern(new RegExp(emailRegex)).required(),
	cpf: joi.string().min(11).max(11).pattern(new RegExp(cpfRegex)).required(),
	password: joi.string().pattern(new RegExp(strongPasswordRegex)).required(),
});

export { usersSchema };
