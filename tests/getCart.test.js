import "../src/setup.js";
import app from '../src/app.js';
import supertest from 'supertest';
import connection from '../src/database/connection.js';
import { createUser } from "./factories/createUser.js";
import { createSession } from "./factories/createSession.js";

describe("GET /cart", () => {
    let USER;
    let SESSION;
    let CART;

    it("response 201 for no cart previously saved", async () => {
        USER = await createUser()
        SESSION = await createSession(USER.id)

        const result = await supertest(app)
            .get("/cart")
            .set({ Authorization: `Bearer ${SESSION.token}` })
        expect(result.status).toEqual(201)
    })
})

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
