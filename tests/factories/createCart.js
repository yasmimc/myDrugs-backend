import connection from "../../src/database/connection.js";

export default async function createCart(userId) {
    const createdCart = await connection.query('INSERT INTO carts (user_id) VALUES ($1) RETURNING *;', [ userId ])
    return createdCart.rows[0]
}
