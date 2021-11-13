import faker from "faker";
import connection from "../../src/database/connection.js";

export default async function createPaymentWay() {
    try {
        const paymentMethod = faker.finance.transactionType()
        const payWay = await connection.query('INSERT INTO payment_ways (name) VALUES ($1) RETURNING *;', [ paymentMethod ])
        return payWay.rows[0]
    } catch(e) {
        return e
    }
}