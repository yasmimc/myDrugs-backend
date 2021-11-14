import connection from "../database/connection.js";
import { cartIncrementBodySchema } from "../database/validations/schemas.js";

/** 
 * Get the user carts there are not associated with a checkout.
 * if none is found, creates one and send its basic data;
 */
async function getCart(req, res) {
    const token = req.headers.authorization.replace("Bearer ", "")

    try {
        const dbUserIdSearch = await connection.query('SELECT * FROM sessions WHERE token = $1 AND is_expired = FALSE;', [ token ])
        if(!dbUserIdSearch.rows.length) return res.sendStatus(404)

        const dbCartSearch = await connection.query(
            'SELECT * FROM carts WHERE user_id = $1 AND id NOT IN (SELECT cart_id FROM checkouts);',
            [ dbUserIdSearch.rows[0].user_id ]
        )

        if(dbCartSearch.rows.length) return res.status(200).send(dbCartSearch.rows[0])

        const newCart = await connection.query(
            'INSERT INTO carts (user_id) VALUES ($1) RETURNING *;',
            [ dbUserIdSearch.rows[0].user_id ]
        )

        return res.status(201).send(newCart.rows[0])
    } catch(e) {
        console.log("ERROR: GET /carts")
        console.log(e)
        return res.sendStatus(500)
    }
}

async function addToCart(req, res) {
    if(cartIncrementBodySchema.validate(req.body).error) return res.sendStatus(422)

    try {
        const { cartId, productId, amount } = req.body;

        //check if product id is already on cart and updates it if it is:
        const productAlreadyOnCart = await connection.query(
            'UPDATE cart_products SET amount = $1 WHERE cart_id = $2 AND product_id = $3 RETURNING *;',
            [ amount, cartId, productId ]
        )

        if(productAlreadyOnCart.rows.length) return res.sendStatus(200)

        await connection.query(
            'INSERT INTO cart_products (cart_id, product_id, amount) VALUES ($1, $2, $3)',
            [ cartId, productId, amount ]
        )

        return res.sendStatus(201)
    } catch(e) {
        console.log("ERROR PUT /cart")
        console.log(e)
        return res.sendStatus(500)
    }

}

export {
    getCart,
    addToCart
}