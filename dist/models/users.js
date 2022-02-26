"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const database_1 = __importDefault(require("../database"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const hashPassword = (password) => {
    const salt_rounds = Number(process.env.SALT_ROUNDS);
    return bcrypt_1.default.hashSync(`${password}`, salt_rounds);
};
class UserModel {
    async index() {
        try {
            const conn = await database_1.default.connect();
            const sql = 'SELECT username, firstname, lastname, id FROM users';
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        }
        catch (err) {
            throw new Error(`Could not get users. Error: ${err}`);
        }
    }
    async show(id) {
        try {
            const sql = 'SELECT username, firstname, lastname, id FROM users WHERE id=$1';
            const conn = await database_1.default.connect();
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`Could not find user ${id}. Error: ${err}`);
        }
    }
    async create(u) {
        try {
            const sql = 'INSERT INTO users (username, firstname, lastname, password) VALUES($1, $2, $3, $4)\
                         RETURNING username, firstname, lastname, id';
            const conn = await database_1.default.connect();
            const result = await conn
                .query(sql, [u.username, u.firstname, u.lastname, hashPassword(u.password)]);
            const user = result.rows[0];
            conn.release();
            return user;
        }
        catch (err) {
            throw new Error(`Could not add new user ${u.username}. Error: ${err}`);
        }
    }
    async update(u, hash) {
        try {
            const sql = 'UPDATE users SET username=$5, firstname=$1, lastname=$2, password=$3 WHERE id=$1 \
                         RETURNING username, firstname, lastname, id';
            const conn = await database_1.default.connect();
            const result = await conn.query(sql, [u.username, u.firstname, u.lastname, hashPassword(u.password)]);
            const user = result.rows[0];
            conn.release();
            return user;
        }
        catch (err) {
            throw new Error(`Could not update user ${u.username}. Error: ${err}`);
        }
    }
    async delete(id) {
        try {
            const sql = 'DELETE FROM users WHERE id=$1 RETURNING *';
            const conn = await database_1.default.connect();
            const result = await conn.query(sql, [id]);
            const user = result.rows[0];
            conn.release();
            return user;
        }
        catch (err) {
            throw new Error(`Could not delete user ${id}. Error: ${err}`);
        }
    }
    async authenticate(username, password) {
        try {
            const conn = await database_1.default.connect();
            const sql = 'SELECT password FROM users WHERE username=$1';
            const result = await conn.query(sql, [username]);
            if (result.rows.length) {
                const { password: hashPassword } = result.rows[0];
                const isValid = bcrypt_1.default.compareSync(`${password}`, hashPassword);
                if (isValid) {
                    const userInfo = await conn.query('SELECT id, username, firstname, lastname FROM users WHERE username=$1', [username]);
                    return userInfo.rows[0];
                }
            }
            conn.release();
            return null;
        }
        catch (err) {
            throw new Error(`Could not to login. Error: ${err}`);
        }
    }
}
exports.UserModel = UserModel;
