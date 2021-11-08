import dotenv from 'dotenv';

const envFile = process.env.NODE_ENV === 'prod' ? '.env.prod' : '.env';

dotenv.config({
  path: envFile
});