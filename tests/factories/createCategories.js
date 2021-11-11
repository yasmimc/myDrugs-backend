import faker from 'faker';
import connection from '../../src/database/connection.js';

export default async function createCategories(howMany) {
    try {
        const promises = []

        for(let i = 0; i < howMany; i++) {
            const name = faker.commerce.department();
            /* console.log(name) */
            const categories = connection.query(
                'INSERT INTO categories (name) VALUES ($1) RETURNING *;',
                [ name ]
            )
            promises.push(categories)
        }
        const results = await Promise.all(promises)
        return results.map(result => result.rows[0])
    } catch(e) {
        return e
    }
}

/* const howMany = await createCategories(2)
console.log(howMany) */