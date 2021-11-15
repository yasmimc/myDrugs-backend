import "../src/setup.js";
import app from "../src/app.js";
import supertest from "supertest";
import connection from "../src/database/connection.js";
import { createUser } from "./factories/createUser.js";
import { createSession } from "./factories/createSession.js";

describe("GET /sessions", () => {
	let user;
	let session;

	beforeAll(async () => {
		user = await createUser();
		session = await createSession(user.id, "jest agent");
	});

	it("returns 200 when session is active", async () => {
		const result = await supertest(app)
			.get("/sessions")
			.set({ Authorization: `Bearer ${session.token}` });
		expect(result.status).toEqual(200);
	});

	it("returns 404 when session is not active", async () => {
		const secondLogin = await supertest(app)
			.post("/sign-in")
			.send({
				email: user.email,
				password: user.password,
			})
			.set({ "user-agent": "jest agent" });
		const result = await supertest(app)
			.get("/sessions")
			.set({ Authorization: `Bearer ${session.token}` });
		expect(result.status).toEqual(404);
	});
});

afterAll(async () => {
	await connection.query("DELETE FROM payment_ways");
	await connection.query("DELETE FROM sessions");
	await connection.query("DELETE FROM checkouts");
	await connection.query("DELETE FROM cart_products");
	await connection.query("DELETE FROM products");
	await connection.query("DELETE FROM categories");
	await connection.query("DELETE FROM carts");
	await connection.query("DELETE FROM users");

	connection.end();
});
