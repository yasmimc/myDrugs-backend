import connection from '../../src/database/connection';
import faker from 'faker';

//Creates one product for each category id inserted
export default async function createProducts(categoryIds) {
    const productPromises = categoryIds.map(id => {
        const stockTotal = parseInt(Math.random()*10)
        const price = Math.random()*10;
        const name = faker.commerce.productName();
        const description = faker.lorem.sentence();
        const image = faker.random.image();
        return connection.query(
            `INSERT INTO products 
            (name, description, category_id, stock_total, price, image) 
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`,
            [ name,description, id, stockTotal, price, image]
        )
    })
    const result = await Promise.all(productPromises)
    return result.map(product => product.rows[0])
}