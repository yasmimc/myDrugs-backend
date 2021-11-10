import app from '../src/app.js';
import supertest from 'supertest';
import connection from '../src/database/connection.js';
import { v4 as uuid } from 'uuid';

describe("GET /products", () => {

    it("response 401 for test", async () => {
        const result = await supertest(app).get("/products")
        expect(result.status).toEqual(401)
    })
});