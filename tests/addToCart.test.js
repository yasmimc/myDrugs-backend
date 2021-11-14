import "../src/setup.js";
import app from "../src/app.js";
import supertest from "supertest";
import { v4 as uuid } from "uuid";
import connection from '../src/database/connection.js';
import { createUser } from "./factories/createUser.js";
import { createSession } from "./factories/createSession.js";
import createCategories from "./factories/createCategories.js";
import createProducts from "./factories/createProducts.js";
import createCart from "./factories/createCart.js";


describe("PUT /cart", () => {
    let USER;
    let SESSION;
    let CART;
    let CATEGORIES;
    let PRODUCTS;

    function createBody(amount) {
        return {
            cartId: CART.id,
            productId: PRODUCTS[0].id,
            amount,
        }
    }

    beforeAll(async () => {
        USER = await createUser()
        SESSION = await createSession(USER.id)
        CATEGORIES = await createCategories(3)
        PRODUCTS = await createProducts(CATEGORIES.map(category => category.id))
        CART = await createCart(USER.id);
    })

    it("response 401 after sending invalid body", async () => {
        const userTwo = await createUser()
        const sessionTwo = await createSession(userTwo.id)

        const result = await supertest(app)
            .put("/cart")
            .send(createBody(1))
            .set({ Authorization: `Bearer ${sessionTwo.token}` })
        
        expect(result.status).toBe(401);
    })

    it("response 422 after sending invalid body", async () => {
        const result = await supertest(app)
            .put("/cart")
            .send({})
            .set({ Authorization: `Bearer ${SESSION.token}` })
        
        expect(result.status).toBe(422);
    })

    it("response 201/200 after sending new/existing product to cart", async () => {
        let result = await supertest(app)
            .put("/cart")
            .send(createBody(1))
            .set({ Authorization: `Bearer ${SESSION.token}` })
        expect(result.status).toBe(201);

        result = await supertest(app)
            .put("/cart")
            .send(createBody(2))
            .set({ Authorization: `Bearer ${SESSION.token}` })
        expect(result.status).toBe(200);
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