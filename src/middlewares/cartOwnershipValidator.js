import connection from "../database/connection.js";
import { cartIncrementBodySchema } from "../database/validations/schemas.js";

export default async function verifyCartOwnership(req, res, next) {
    const token = req.headers.authorization.replace("Bearer ", "")

    if(cartIncrementBodySchema.validate(req.body).error) return res.sendStatus(422)
    const { cartId } = req.body;

    try {
        const validation = await connection.query(
            'SELECT * FROM carts WHERE id = $1 AND user_id = (SELECT user_id FROM sessions WHERE token = $2);',
            [ cartId, token ]
        )
    
        if(!validation.rows.length) return res.sendStatus(401)
    } catch(e) {
        console.log("cart ownership veryfication failure")
        console.log(e)
        return res.sendStatus(500)
    }
    next()
}
