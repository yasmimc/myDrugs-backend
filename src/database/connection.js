import pg from "pg";

const { Pool } = pg;

const config =
	process.env.NODE_ENV === "test"
		? {
				user: process.env.DB_USER,
				password: process.env.DB_PASSWORD,
				host: process.env.DB_HOST,
				port: process.env.DB_PORT,
				database: process.env.DB_NAME,
		  }
		: {
				connectionString: process.env.DATABASE_URL,
				ssl: {
					rejectUnauthorized: false,
				},
		  };

console.log(config)

const connection = new Pool(config);

export default connection;