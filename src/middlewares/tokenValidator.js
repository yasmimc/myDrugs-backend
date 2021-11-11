import connection from '../database/connection.js';
import { validate as uuidValidate } from 'uuid';

export default async function validateToken(req, res, next) {
    const { authorization } = req.headers
    if(!authorization || authorization.trim() === "" || !authorization.includes("Bearer ")) return res.sendStatus(400)

    const token = authorization.replace("Bearer ", "")
    console.log("token: ", token)
    if(token.trim() === "") return res.sendStatus(422)
    if(!uuidValidate(token)) return res.sendStatus(400)

    try {
        const dbResponse = await connection.query('SELECT * FROM sessions WHERE token = $1;', [ token ])
        console.log("dbRows: ", dbResponse.rows)
        if(!dbResponse.rows.length) return res.sendStatus(404)
        next()
    } catch(e) {
        console.log("FAIL in validateToken")
        console.log(e)
        return res.sendStatus(500)
    }

}