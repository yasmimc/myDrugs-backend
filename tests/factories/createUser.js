import faker from "faker";
import connection from "../../src/database/connection.js";
import bcrypt from "bcrypt";

/*createUser takes an optional parameter (dontSave) that says 
whether user data should not be saved to the database*/
export async function createUser(dontSave) {
	let cpf = "";

	while (cpf.length < 11) {
		cpf += parseInt(Math.random() * 10, 10);
	}

	const user = {
		name: faker.name.findName(),
		email: faker.internet.email(),
		password: "123qweASD@",
		cpf,
	};

	const encryptedPassword = bcrypt.hashSync(user.password, 10);

	let newUser;
	if (!dontSave) {
		newUser = await connection.query(
			"INSERT INTO users (name, email, cpf, password) VALUES ($1, $2, $3, $4) RETURNING *;",
			[user.name, user.email, user.cpf, encryptedPassword]
		);
		user.id = newUser.rows[0].id;
	}
	return user;
}