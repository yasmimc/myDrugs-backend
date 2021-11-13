import { checkoutSchema } from '../database/schemas.js';
import connection from '../database/connection.js';
import { v4 as uuid } from 'uuid';
import mailer from '../services/mailer.js';

export async function checkout(req, res) {
    if(checkoutSchema.validate(req.body).error) return res.sendStatus(422)
    const {
        userId,
        paymentId,
        cartId,
        name,
        email,
        cep,
        addressNumber,
    } = req.body;

    try {
        const code = uuid();
        const productCheckout = await connection.query(
            'INSERT INTO checkouts (cart_id, payment_id, code, cep, address_number, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;',
            [ cartId, paymentId, code, cep, addressNumber, userId ]
        )

        // mailer without await throws a warning in jest: "A worker process has failed to exit gracefully and has been force exited."
        mailer({
            to: email,
            subject: "Compra Confirmada!",
            text: `Olá, ${name.split(" ")[0]}, sua compra foi confirmada e pode ser acompanhada no painel do usuário em nosso site.
            muito obrigado, esperamos te ver mais vezes.`
        })

        return res.status(201).send(productCheckout.rows[0]);
    } catch(e) {
        console.log("ERROR POST /checkout")
        console.log(e)
        return res.sendStatus(500)
    }
}