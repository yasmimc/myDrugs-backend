import connection from "../database/connection.js";
import { usersSchema } from "../database/validations/schemas.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { userAlredyExists, sessionAlredyExists } from "../helpers/users.js";

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
			`INSERT INTO users (name, email, cpf, password) VALUES ($1, $2, $3, $4)`,
			[name, email, cpf, encryptedPassword]
		);
		res.sendStatus(201);
	} catch (error) {
		console.log(error.message);
		res.send(500);
	}
}

async function signIn(req, res) {
	const { email, cpf, password } = req.body;

	if (!(email || cpf) || !password) {
		res.sendStatus(400);
		return;
	}

	const user = await userAlredyExists(email, cpf);

	if (!user) {
		res.sendStatus(404);
		return;
	}

	if (!bcrypt.compareSync(password, user.password)) {
		res.sendStatus(401);
		return;
	}

	try {
		const device = req.headers?.["user-agent"];

		const previousSession = await sessionAlredyExists(user.id, device);

		if (previousSession) {
			await connection.query(
				`UPDATE sessions SET is_expired = true WHERE id = $1`,
				[previousSession.id]
			);
		}
		const token = uuid();

		connection.query(
			`INSERT INTO sessions ("user_id", token, device) VALUES ($1, $2, $3)`,
			[user.id, token, device]
		);

		delete user.password;
		res.status(200).send({ token, user });
	} catch (error) {
		console.log(error.message);
		res.send(500);
	}
}

export { signUp, signIn };
