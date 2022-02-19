import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();


const client = new Pool({
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database:
      process.env.ENV === "test" ? process.env.POSTGRES_TEST_DB : process.env.POSTGRES_DB
});

export default client;
