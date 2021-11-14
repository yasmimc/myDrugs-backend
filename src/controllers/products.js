import connection from '../database/connection.js';

async function getProducts(req, res) {
    try {
        const products = await connection.query(`
        SELECT  products.id,
                products.name,
                categories.name AS category,
                stock_total,
                image,
                price,
                description FROM products
        JOIN categories ON products.category_id = categories.id;
        `);
        if (!products.rowCount) return res.sendStatus(204);
        return res.send(products.rows);
    } catch (e) {
        console.log("ERROR GET /products")
        console.log(e)
        return res.sendStatus(500)
    }
}

export {
    getProducts
}