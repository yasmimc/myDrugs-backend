import app from '../src/app.js';
import supertest from 'supertest';
import connection from '../src/database/connection.js';
import { v4 as uuid } from 'uuid';
import { createUser } from './factories/createUser.js';
import { createSession } from './factories/createSession.js';
import createCategories from './factories/createCategories.js';
import createProducts from './factories/createProducts.js';
import createCheckoutBody from './factories/createCheckoutBody.js';

describe("feat/ checkout POST /checkout", () => {

    let USER;
    let PRODUCTS;
    let SESSION;

    beforeAll(async () => {
        USER = await createUser();
        SESSION = await createSession(USER.id);
        const categories = await createCategories();
        PRODUCTS = await createProducts(categories.map(category => category.id))
    })

    it("response 404 sending invalid token", async () => {
        const body = createCheckoutBody(USER, PRODUCTS)
        const invalidToken = uuid();
        const result = await supertest(app).post("/checkout").send(body).set({ Authorization: `Bearer ${invalidToken}` })
        expect(result.status).toEqual(404)
    })

    it("response 422 after sending invalid body", async () => {
        const body = {}
        const result = await supertest(app).post("/checkout").send(body).set({ Authorization: `Bearer ${SESSION.token}` })
        expect(result.status).toEqual(422)
    })

    it("response 201 after seding proper data", async () => {
        const body = createCheckoutBody(USER, PRODUCTS)
        const result = await supertest(app).post("/checkout").send(body).set({ Authorization: `Bearer ${SESSION.token}` })
        expect(result.status).toEqual(201)
    })

    afterAll(() => { connection.end() })

})