import dotenv from "dotenv";

const envFile = process.env.NODE_ENV === "prod" ? ".env" : ".env.test";

dotenv.config({
	path: envFile,
});
