import connection from "../../src/database/connection.js";
import faker from "faker";
import { v4 as uuid } from "uuid";

export async function createSession(userId, device) {
	const session = {
		token: uuid(),
		device: device ? device : faker.internet.userAgent(),
		user_id: userId,
	};

	const sessionCreated = await connection.query(
		"INSERT INTO sessions (user_id, token, device) VALUES ($1, $2, $3) RETURNING *;",
		[session.user_id, session.token, session.device]
	);

	session.id = sessionCreated.rows[0].id;
	return session;
}
