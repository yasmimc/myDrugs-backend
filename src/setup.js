import dotenv from 'dotenv';

const envFile = process.env.NODE_ENV === 'prod' ? '.env.prod' : '.env.test';

dotenv.config({
  path: envFile
});