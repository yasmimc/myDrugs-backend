import connection from '../database/connection.js';

async function getProducts(req, res) {
    try {
        const dbResponse = await connection.query('SELECT * FROM products');
        return res.send(dbResponse);
    } catch(e) {
        console.log("ERROR GET /products")
        console.log(e)
        return res.sendStatus(500)
    }
}

export {
    getProducts
}