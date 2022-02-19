import bcrypt from "bcrypt";
import client from "../database";
import dotenv from "dotenv";

dotenv.config()

const salt_rounds = Number(process.env.SALT_ROUNDS)

export type User = {
    id: string;
    firstName: string;
    lastName: string;
    password: string
}

export class UserStore {
    async index(): Promise<User[]> {
        try {
            const conn = await client.connect()
            const sql = 'SELECT * FROM users'
            const result = await conn.query(sql)
            conn.release()

            return result.rows 
        } catch (err) {
            throw new Error(`Could not get users. Error: ${err}`)
        }
    }

    async show(id: string): Promise<User> {
        try {
            const sql = 'SELECT * FROM users WHERE id=$1'
            const conn = await client.connect()
            const result = await conn.query(sql, [id])
            conn.release()

            return result.rows[0]
        } catch (err) {
            throw new Error(`Could not find user ${id}. Error: ${err}`)
        }
    }

    async create(b: User): Promise<User> {
        try {
            const hashPassword = await bcrypt.hash(b.password, salt_rounds)
            const sql = 'INSERT INTO users (firstName, lastName, password) VALUES($1, $2, $3) RETURNING *'
            const conn = await client.connect()
            const result = await conn
                .query(sql, [b.firstName, b.lastName, hashPassword])
            const user = result.rows[0]
            conn.release()

            return user
        } catch (err) {
            throw new Error(`Could not add new user ${b.firstName}. Error: ${err}`)
        }
    }

    async update(b:User, hash?: boolean): Promise<User>{
        if (hash) b.password = await bcrypt.hash(b.password, salt_rounds);
        try{
            const sql = 'UPDATE users SET firstName=$1, lastName=$2, password=$3 WHERE id=$1'
            const conn = await client.connect()
            const result = await conn.query(sql, [b.firstName, b.lastName, b.password])
            const user = result.rows[0]
            conn.release()
    
            return user
        } catch (err) {
            throw new Error(`Could not update user ${b.firstName}. Error: ${err}`)
        }
       
    }

    async delete(id: string): Promise<User> {
        try {
            const sql = 'DELETE FROM users WHERE id=$1 RETURNING *'
            const conn = await client.connect()
            const result = await conn.query(sql, [id])
            const user = result.rows[0]
            conn.release()
        
            return user
        } catch (err) {
            throw new Error(`Could not delete user ${id}. Error: ${err}`)
        }
    }
  }