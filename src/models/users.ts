import bcrypt from "bcrypt";
import client from "../database";
import dotenv from "dotenv";

dotenv.config()

const hashPassword = (password: string) => {
    const salt_rounds = Number(process.env.SALT_ROUNDS)
    return bcrypt.hashSync(`${password}`, salt_rounds);
}

export type User = {
    id: string;
    username: string;
    firstname: string;
    lastname: string;
    password: string
}

export class UserModel {
    async index(): Promise<User[]> {
        try {
            const conn = await client.connect()
            const sql = 'SELECT username, firstname, lastname, id FROM users'
            const result = await conn.query(sql)
            conn.release()

            return result.rows 
        } catch (err) {
            throw new Error(`Could not get users. Error: ${err}`)
        }
    }

    async show(id: string): Promise<User> {
        try {
            const sql = 'SELECT username, firstname, lastname, id FROM users WHERE id=$1'
            const conn = await client.connect()
            const result = await conn.query(sql, [id])
            conn.release()

            return result.rows[0]
        } catch (err) {
            throw new Error(`Could not find user ${id}. Error: ${err}`)
        }
    }

    async create(u: User): Promise<User> {
        try {
            const sql = 'INSERT INTO users (username, firstname, lastname, password) VALUES($1, $2, $3, $4)\
                         RETURNING username, firstname, lastname, id'
            const conn = await client.connect()
            const result = await conn
                .query(sql, [u.username, u.firstname, u.lastname, hashPassword(u.password)])
            const user = result.rows[0]
            conn.release()

            return user
        } catch (err) {
            throw new Error(`Could not add new user ${u.username}. Error: ${err}`)
        }
    }

    async update(u:User, hash?: boolean): Promise<User>{
        try{
            const sql = 'UPDATE users SET username=$5, firstname=$1, lastname=$2, password=$3 WHERE id=$1 \
                         RETURNING username, firstname, lastname, id'
            const conn = await client.connect()
            const result = await conn.query(sql, [u.username,u.firstname, u.lastname, hashPassword(u.password)])
            const user = result.rows[0]
            conn.release()
    
            return user
        } catch (err) {
            throw new Error(`Could not update user ${u.username}. Error: ${err}`)
        }
       
    }

    async delete(id: string): Promise<User> {
        try {
            const sql = 'DELETE FROM users WHERE id=$1 RETURNING id, username, firstname, lastname'
            const conn = await client.connect()
            const result = await conn.query(sql, [id])
            const user = result.rows[0]
            conn.release()
        
            return user
        } catch (err) {
            throw new Error(`Could not delete user ${id}. Error: ${err}`)
        }
    }

    async authenticate(username: string, password: string): Promise<User | null>{
        try{
            const conn = await client.connect();
            const sql = 'SELECT password FROM users WHERE username=$1';
            const result = await conn.query(sql, [username]);
            if (result.rows.length) {
                const {password: hashPassword} = result.rows[0];
                const isValid = bcrypt.compareSync(`${password}`, hashPassword);
                if (isValid){
                    const userInfo = await conn.query('SELECT id, username, firstname, lastname FROM users WHERE username=$1', [username])
                    return userInfo.rows[0];
                }
            }
            conn.release();
            return null;
        } catch (err) {
            throw new Error(`Could not to login. Error: ${err}`);
        }
    }
}