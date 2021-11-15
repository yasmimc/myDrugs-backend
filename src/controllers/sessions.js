import connection from "../database/connection.js";

async function logout(req, res) {
	try {
		const token = req.headers.authorization.replace("Bearer ", "");

		const dbResponse = await connection.query(
			"UPDATE sessions SET is_expired = TRUE WHERE token = $1 AND is_expired = FALSE;",
			[token]
		);
		if (!dbResponse.rowCount) return res.sendStatus(404);

		return res.sendStatus(200);
	} catch (e) {
		console.log("ERROR DELETE /sessions");
		console.log(e);
		return res.sendStatus(500);
	}
}

export { logout };
