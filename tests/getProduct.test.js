import "../src/setup.js";
import app from '../src/app.js';
import supertest from 'supertest';
import connection from '../src/database/connection.js';
import createCategories from "./factories/createCategories.js";
import createProducts from "./factories/createProducts.js";

beforeAll(async () => {
    const categories = await createCategories(2);
    await createProducts(categories.map((id) => id.id));
});
afterAll(() => connection.end());
describe("GET /products", () => {
    afterEach(async () => {
        await connection.query("DELETE FROM products");
        await connection.query("DELETE FROM categories");

    });
    it("response 200 for success", async () => {
        const result = await supertest(app).get("/products")
        expect(result.status).toEqual(200);
    })
    it("response 204 for success but no content", async () => {
        const result = await supertest(app).get("/products")
        expect(result.status).toEqual(204);
    })
});
