import { checkoutSchema } from '../database/schemas.js';
import connection from '../database/connection.js';
import { v4 as uuid } from 'uuid';
import mailer from '../services/mailer.js';

export async function checkout(req, res) {
    if(checkoutSchema.validate(req.body).error) return res.sendStatus(422)
    const {
        userId,
        name,
        email,
        cep,
        addressNumber,
        products
    } = req.body;

    try {
        const code = uuid();
        
        const productRequest = await connection.query(
            'INSERT INTO requests (user_id, code, cep, address_number) VALUES ($1, $2, $3, $4) RETURNING *;',
            [ userId, code, cep, addressNumber ]
        )

        const soldProductsPromises = products.map(product => {
            connection.query(
                'INSERT INTO products_sold (request_id, product_id, amount) VALUES ($1, $2, $3);',
                [ productRequest.rows[0].id, product.productId, product.amount ]
            )
        })

        await Promise.all(soldProductsPromises)

        // mailer without await throws a warning in jest: "A worker process has failed to exit gracefully and has been force exited."
        await mailer({
            to: email,
            subject: "Compra Confirmada!",
            text: `Olá, ${name.split(" ")[0]}, sua compra foi confirmada e pode ser acompanhada no painel do usuário em nosso site.
            muito obrigado, esperamos te ver mais vezes.`
        })

        return res.sendStatus(201);
    } catch(e) {
        console.log("ERROR POST /checkout")
        console.log(e)
        return res.sendStatus(500)
    }
}