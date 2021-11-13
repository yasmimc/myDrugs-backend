import connection from "../database/connection";

/** 
 * Get the user carts there are not associated with a checkout.
 * if none is found, creates one and send its basic data;
 */
async function getCart(req, res) {
    const token = req.headers.authorization.replace("Bearer ", "")

    try {
        const dbUserIdSearch = await connection.query('SELECT user_id FROM sessions WHERE token = $1 AND is_expired = FALSE;', [ token ])
        if(!dbUserIdSearch.rows.length) return res.sendStatus(404)

        const dbCartSearch = await connection.query(
            'SELECT * FROM carts WHERE user_id = $1 AND id NOT IN (SELECT cart_id FROM checkouts;);',
            [ dbUserIdSearch.rows[0].id ]
        )

        if(dbCartSearch.rows.length) return res.status(200).send(dbCartSearch.rows[0])

        const newCart = await connection.query(
            'INSERT INTO carts (user_id) VALUES ($1) RETURNING *;',
            [ dbUserIdSearch.rows[0].id ]
        )

        return res.status(201).send(newCart.rows[0])
    } catch(e) {
        console.log("ERROR: GET /carts")
        console.log(e)
        return res.sendStatus(500)
    }
}

export {
    getCart
}