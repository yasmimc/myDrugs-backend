import connection from "../database/connection.js";

async function userAlredyExists(email, cpf) {
	try {
		const existentUser = await connection.query(
			`SELECT * FROM users WHERE email = $1 OR cpf = $2;`,
			[email, cpf]
		);
		if (existentUser.rowCount !== 0) return existentUser.rows[0];
		return false;
	} catch (error) {
		console.log("ERROR func userAlredyExists");
		console.log(error);
		return false;
	}
}

async function sessionAlredyExists(userId, device) {
	try {
		const existentSession = await connection.query(
			`SELECT * FROM sessions WHERE user_id = $1 AND 
				device = $2 AND 
				is_expired = false;`,
			[userId, device]
		);

		if (existentSession.rowCount !== 0) return existentSession.rows[0];
		return false;
	} catch (error) {
		console.log("ERROR func sessionAlredyExists");
		console.log(error);
		return false;
	}
}

export { userAlredyExists, sessionAlredyExists };
