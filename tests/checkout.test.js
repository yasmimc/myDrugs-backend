import app from "../src/app.js";
import supertest from "supertest";
import connection from "../src/database/connection.js";
import { v4 as uuid } from "uuid";
import { createUser } from "./factories/createUser.js";
import { createSession } from "./factories/createSession.js";
import createPaymentWay from "./factories/createPaymentWay.js";
import createCheckoutBody from "./factories/createCheckoutBody.js";
import createCart from "./factories/createCart.js";

describe("feat/ checkout POST /checkout", () => {
	let USER;
	let SESSION;
	let PAYMENT_WAY;
	let CART;

	beforeAll(async () => {
		USER = await createUser();
		SESSION = await createSession(USER.id);
		PAYMENT_WAY = await createPaymentWay()
		CART = await createCart(USER.id)
	});

	it("response 404 sending invalid token", async () => {
		const body = createCheckoutBody(USER, PAYMENT_WAY.id, CART.id);
		const invalidToken = uuid();
		const result = await supertest(app)
			.post("/checkout")
			.send(body)
			.set({ Authorization: `Bearer ${invalidToken}` });
		expect(result.status).toEqual(404);
	});

	it("response 422 after sending invalid body", async () => {
		const body = {};
		const result = await supertest(app)
			.post("/checkout")
			.send(body)
			.set({ Authorization: `Bearer ${SESSION.token}` });
		expect(result.status).toEqual(422);
	});

	it("response 201 after seding proper data", async () => {
		const body = createCheckoutBody(USER, PAYMENT_WAY.id, CART.id);
		const result = await supertest(app)
			.post("/checkout")
			.send(body)
			.set({ Authorization: `Bearer ${SESSION.token}` });
		expect(result.status).toEqual(201);
	});
});

afterAll(async () => {
	await connection.query("DELETE FROM sessions");
	await connection.query("DELETE FROM checkouts");
	await connection.query("DELETE FROM payment_ways");
	await connection.query("DELETE FROM cart_products");
	await connection.query("DELETE FROM products");
	await connection.query("DELETE FROM categories");
	await connection.query("DELETE FROM carts");
	await connection.query("DELETE FROM users");

	connection.end();
});
