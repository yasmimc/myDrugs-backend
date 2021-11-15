import connection from "../database/connection.js";

async function getCartProducts(cartId) {
    const cart = await connection.query(
        `SELECT products.id, products.name, products.description, products.image, products.stock_total as "stockTotal", products.price,
                categories.id AS "categoryId", categories.name AS "categoryName", cart_products.amount FROM products
        JOIN categories ON products.category_id = categories.id
        JOIN cart_products ON cart_products.product_id = products.id
        WHERE products.id IN (SELECT product_id FROM cart_products WHERE cart_id = $1);`,
        [ cartId ]
    )
    return cart.rows
}

export {
    getCartProducts
}