import faker from 'faker';
import connection from '../../src/database/connection.js';

export async function createUser() {
    let cpf = ""

    while(cpf.length < 11) { cpf += parseInt(Math.random()*10, 10) }

    const user = {
        name: faker.name.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        cpf,
    }

    const newUser = await connection.query(
        'INSERT INTO users (name, email, cpf, password) VALUES ($1, $2, $3, $4) RETURNING *;',
        [ user.name, user.email, user.cpf, user.password ]
    )

    user.id = newUser.rows[0].id
    return user;
}