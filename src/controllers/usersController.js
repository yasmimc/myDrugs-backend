import connection from "../database/connection.js";
import { usersSchema } from "../database/validations/schemas.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

async function signUp(req, res) {
	const { name, email, cpf, password } = req.body;

	const validation = usersSchema.validate({
		name,
		email,
		cpf,
		password,
	});

	if (validation.error) {
		console.log(
			`${validation.error.details.length} SCHEMA VALIDATION ERRORS FOUND:`
		);
		validation.error.details.forEach((error) => console.log(error.message));
		res.sendStatus(400);
		return;
	}

	if (await userAlredyExists(email, cpf)) {
		res.sendStatus(409);
		return;
	}

	try {
		const encryptedPassword = bcrypt.hashSync(password, 10);

		connection.query(
			"INSERT INTO users (name, email, cpf, password)) VALUES ($1, $2, $3, $4)",
			[name, email, cpf, encryptedPassword]
		);
		res.sendStatus(201);
	} catch (error) {
		console.log(error.message);
		res.send(500);
	}
}

async function userAlredyExists(email, cpf) {
	const existentUser = await connection.query(
		`SELECT * FROM users WHERE email = $1 OR cpf = $2;`,
		[email, cpf]
	);
	if (existentUser.rowCount !== 0) return existentUser.rows;
	return false;
}

export { signUp };
