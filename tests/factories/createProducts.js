import connection from '../../src/database/connection';
import faker from 'faker';

export default async function createProducts(categoryIds) {
    const productPromises = categoryIds.map(id => {
        const stockTotal = parseInt(Math.random()*10)
        const name = faker.commerce.productName;
        connection.query(
            'INSERT INTO products (name, category_id, stock_total) VALUES ($1, $2, $3) RETURNING *;',
            [ name, id, stockTotal ]
        )
    })
    const result = await Promise.all(productPromises)
    return result.map(product => product.rows[0])
}