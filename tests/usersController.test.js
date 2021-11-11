import "../src/setup.js";
import app from "../src/app.js";
import supertest from "supertest";
import connection from "../src/database/connection.js";

describe("POST /sign-up", () => {
	beforeAll(async () => {
		await connection.query("DELETE FROM users");
	});

	afterEach(async () => {
		await connection.query("DELETE FROM users");
		await connection.query(
			`INSERT INTO users (name, cpf, email, password) VALUES ('Nome', '01234567890', 'email@email.com', '123qweASD@')`
		);
	});

	it("returns 201 for new user with valid params", async () => {
		const body = {
			name: "Nome",
			cpf: "01234567890",
			email: "email@email.com",
			password: "123qweASD@",
		};

		const result = await supertest(app).post("/sign-up").send(body);
		const status = result.status;

		expect(status).toEqual(201);
	});

	it("returns 400 for invalid user params", async () => {
		const body = {
			name: "Nome",
			email: "email@email.com",
			password: "123qweASD@",
		};

		const result = await supertest(app).post("/sign-up").send(body);
		const status = result.status;

		expect(status).toEqual(400);
	});

	it("returns 409 for existent user", async () => {
		const body = {
			name: "Nome",
			cpf: "01234567890",
			email: "email@email.com",
			password: "123qweASD@",
		};

		const result = await supertest(app).post("/sign-up").send(body);
		const status = result.status;

		expect(status).toEqual(409);
	});
});

describe("POST /sign-in", () => {
	beforeAll(async () => {
		await connection.query("DELETE FROM sessions");
		await connection.query("DELETE FROM users");

		await connection.query(
			`INSERT INTO users (name, cpf, email, password) VALUES ('Nome', '01234567890', 'email@email.com', '$2b$10$lEW0nTC2CRK6QkAPRg2wbOTUtdqtogEzZgMdnjETkbnlEiQL2nwv6')`
		);
	});

	beforeEach(async () => {
		await connection.query("DELETE FROM sessions");
	});

	it("returns 200 for successful sign in using email", async () => {
		const body = {
			email: "email@email.com",
			password: "123qweASD@",
		};

		const result = await supertest(app)
			.post("/sign-in")
			.send(body)
			.set({ "user-agent": "jest" });
		const status = result.status;

		expect(status).toEqual(200);
	});

	it("returns 200 for successful sign in using cpf", async () => {
		const body = {
			cpf: "01234567890",
			password: "123qweASD@",
		};

		const result = await supertest(app)
			.post("/sign-in")
			.send(body)
			.set({ "user-agent": "jest" });
		const status = result.status;

		expect(status).toEqual(200);
	});

	it("returns 400 for invalid user params", async () => {
		const body = {
			name: "Nome",
			password: "123qweASD@",
		};

		const result = await supertest(app)
			.post("/sign-in")
			.send(body)
			.set({ "user-agent": "jest" });
		const status = result.status;

		expect(status).toEqual(400);
	});

	it("returns 404 for non existent user", async () => {
		const body = {
			cpf: "01234567899",
			password: "123qweASD@",
		};

		const result = await supertest(app)
			.post("/sign-in")
			.send(body)
			.set({ "user-agent": "jest" });
		const status = result.status;

		expect(status).toEqual(404);
	});

	it("returns 401 for incorrect password", async () => {
		const body = {
			cpf: "01234567890",
			password: "123qweASD",
		};

		const result = await supertest(app)
			.post("/sign-in")
			.send(body)
			.set({ "user-agent": "jest" });
		const status = result.status;

		expect(status).toEqual(401);
	});
});

beforeAll(async () => {
	await connection.query("DELETE FROM sessions");
	await connection.query("DELETE FROM users");
});

afterAll(async () => {
	await connection.query("DELETE FROM sessions");
	await connection.query("DELETE FROM users");
});
