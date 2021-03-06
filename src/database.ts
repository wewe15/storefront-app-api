import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();


const client = new Pool({
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT as string),
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database:
      process.env.ENV === "test" ? process.env.POSTGRES_TEST_DB : process.env.POSTGRES_DB
});

client.on('error', (error: Error) => {
  console.error(error.message);
})

export default client;
