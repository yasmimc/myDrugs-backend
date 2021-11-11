import "../src/setup.js";
import app from '../src/app.js';
import supertest from 'supertest';
import connection from '../src/database/connection.js';
import { v4 as uuid } from 'uuid';
import { createUser } from './factories/createUser.js';
import { createSession } from './factories/createSession.js';

describe("feat/logout DELETE /sessions", () => {
    let user;
    let session;

    beforeAll(async () => {
        user = await createUser();
        session = await createSession(user.id);
    })

    afterAll(async () => {
        await connection.query("DELETE FROM products_sold");
        await connection.query("DELETE FROM requests");
        await connection.query("DELETE FROM categories");
        await connection.query("DELETE FROM products");
        await connection.query("DELETE FROM sessions");
        await connection.query("DELETE FROM users");
    
        connection.end();
    });

    it("response 400 after sending none or unformated token", async () => {
        let result = await supertest(app).delete("/sessions")
        expect(result.status).toEqual(400)

        result = await supertest(app).delete("/sessions").set({ Authorization: "   " })
        expect(result.status).toEqual(400)

        result = await supertest(app).delete("/sessions").set({ Authorization: "123" })
        expect(result.status).toEqual(400)
    })

    it("reponse 422 after sending only 'Bearer '", async () => {
        const result = await supertest(app).delete("/sessions").set({ Authorization: "Bearer " })
        expect(result.status).toEqual(400)
    })

    it("response 404 after sending a non existing token", async () => {
        const fakeToken = uuid();
        const result = await supertest(app).delete("/sessions").set({ Authorization: `Bearer ${fakeToken}` })
        expect(result.status).toEqual(404)
    })

    it("response 200 after sending proper data", async () => {
        const result = await supertest(app).delete("/sessions").set({ Authorization: `Bearer ${session.token}` })
        expect(result.status).toEqual(200)
    })

    it("response 404 after trying logout already logged out session", async () => {
        await supertest(app).delete("/sessions").set({ Authorization: `Bearer ${session.token}` })
        const result = await supertest(app).delete("/sessions").set({ Authorization: `Bearer ${session.token}` })
        expect(result.status).toEqual(404)
    })

})