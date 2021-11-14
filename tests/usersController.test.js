import "../src/setup.js";
import app from "../src/app.js";
import supertest from "supertest";
import connection from "../src/database/connection.js";
import { createUser } from "./factories/createUser.js";

import faker from "faker";
import { createSession } from "./factories/createSession.js";

describe("POST /sign-up", () => {
	let mockUser;

	beforeAll(async () => {
		await connection.query("DELETE FROM users");

		/*createUser takes an optional parameter (dontSave) that says 
		whether user data should not be saved to the database*/
		mockUser = await createUser(true);
	});

	it("returns 201 for new user with valid params", async () => {
		const result = await supertest(app).post("/sign-up").send(mockUser);
		const status = result.status;

		expect(status).toEqual(201);
	});

	it("returns 400 for invalid user params", async () => {
		const body = { ...mockUser };
		delete body.cpf;
		delete body.email;

		const result = await supertest(app).post("/sign-up").send(body);
		const status = result.status;

		expect(status).toEqual(400);
	});

	it("returns 409 for existent user", async () => {
		const newUser = await createUser();
		const result = await supertest(app).post("/sign-up").send(newUser);
		const status = result.status;

		expect(status).toEqual(409);
	});
});

describe("POST /sign-in", () => {
	let mockUser;
	beforeAll(async () => {
		mockUser = await createUser();
	});

	beforeEach(async () => {
		await connection.query("DELETE FROM sessions");
	});

	it("returns 200 for successful sign in using email", async () => {
		const body = {
			email: mockUser.email,
			password: mockUser.password,
		};

		const result = await supertest(app)
			.post("/sign-in")
			.send(body)
			.set({ "user-agent": faker.internet.userAgent() });
		const status = result.status;
		const resp = result.body;

		expect(status).toEqual(200);
		expect(resp).toHaveProperty("token");
		expect(resp).toHaveProperty("user");
	});

	it("returns 200 for successful sign in using cpf", async () => {
		const body = {
			cpf: mockUser.cpf,
			password: mockUser.password,
		};

		const result = await supertest(app)
			.post("/sign-in")
			.send(body)
			.set({ "user-agent": faker.internet.userAgent() });
		const status = result.status;
		const resp = result.body;

		expect(status).toEqual(200);
		expect(resp).toHaveProperty("token");
		expect(resp).toHaveProperty("user");
	});

	it("returns 400 for invalid user params", async () => {
		const body = {
			name: mockUser.name,
			password: mockUser.password,
		};

		const result = await supertest(app)
			.post("/sign-in")
			.send(body)
			.set({ "user-agent": faker.internet.userAgent() });
		const status = result.status;

		expect(status).toEqual(400);
	});

	it("returns 404 for non existent user", async () => {
		//createUser takes an optional parameter (dontSave) that says
		//whether user data should not be saved to the database
		const nonExistentUser = await createUser(true);

		const body = {
			cpf: nonExistentUser.cpf,
			password: nonExistentUser.password,
		};

		const result = await supertest(app)
			.post("/sign-in")
			.send(body)
			.set({ "user-agent": faker.internet.userAgent() });
		const status = result.status;

		expect(status).toEqual(404);
	});

	it("returns 401 for incorrect password", async () => {
		const body = {
			cpf: mockUser.cpf,
			password: "123qweASD",
		};

		const result = await supertest(app)
			.post("/sign-in")
			.send(body)
			.set({ "user-agent": faker.internet.userAgent() });
		const status = result.status;

		expect(status).toEqual(401);
	});

	it("log off active session with the same device", async () => {
		const firstSession = await createSession(mockUser.id, "jest agent");

		const body = {
			cpf: mockUser.cpf,
			password: mockUser.password,
		};

		await supertest(app)
			.post("/sign-in")
			.send(body)
			.set({ "user-agent": "jest agent" });

		const firstSessionIsActive = await connection.query(
			`SELECT is_expired FROM sessions WHERE id = ${firstSession.id}`
		);

		expect(firstSessionIsActive.rows[0].is_expired).toBe(true);
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
});

afterAll(async () => {
	connection.end();
});
