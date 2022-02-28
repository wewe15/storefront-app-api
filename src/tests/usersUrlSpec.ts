import { UserModel, User } from "../models/users";
import client from "../database";
import supertest from "supertest";
import app from "../server";


const userModel = new UserModel();
const request = supertest(app)
let token = '';

describe('Test users API endpoint ', () => {
    it('Get the / endpoint', async () => {
        const res = await request.get("/");
        expect(res.status).toBe(200);
    });
    const user = {
        username: 'testuser',
        firstname: 'test',
        lastname: 'user',
        password: 'passtest123'
    } as User

    beforeAll(async () => {
        const createdUser = await userModel.create(user);
        user.id = createdUser.id;
    });

    afterAll(async () => {
        const conn = await client.connect();
        const sql = 'ALTER SEQUENCE users_id_seq RESTART WITH 1; DELETE FROM users;';
        await conn.query(sql);
        conn.release();
    });

    it('should be able to authenticate to get token', async () => {
        const res = await request
            .post('/users/authenticate')
            .set('Content-type', 'application/json')
            .send({
                username: "testuser",
                password: "passtest123"
            });
        expect(res.status).toBe(200);
        const {id, username, token: userToken} = res.body;
        expect(id).toBe(user.id);
        expect(username).toBe("testuser");
        token = userToken;
    });

    it('should be failed to authenticate with wrong username', async () => {
        const res = await request
            .post('/users/authenticate')
            .set('Content-type', 'application/json')
            .send({
                username: "wronguser",
                password: "wrongpassword"
            });
        expect(res.status).toBe(401);
    });

    it('should create new user', async () => {
        const res = await request
            .post('/users')
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({
                username: "test",
                firstname: "test1",
                lastname: "user2",
                password: "passtest123"
            } as User);
        expect(res.status).toBe(200);
        const {username, firstname, lastname} = res.body;
        expect(username).toBe("test");
        expect(firstname).toBe("test1");
        expect(lastname).toBe("user2")
    });

    it('should get list of users', async () => {
        const res = await request
            .get('/users')
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body.length).toBe(2);
    });

    it('should get user by id', async () => {
        const res = await request
            .get(`/users/${user.id}`)
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
        expect(res.status).toBe(200);
        const {username, firstname, lastname} = res.body;
        expect(username).toBe("testuser");
        expect(firstname).toBe("test");
        expect(lastname).toBe("user")
    });

    it('should delete user by id', async () => {
        const res = await request
            .delete(`/users/${user.id}`)
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
        expect(res.status).toBe(200);
        const {id, username, firstname, lastname} = res.body;
        expect(id).toBe(user.id)
        expect(username).toBe("testuser");
        expect(firstname).toBe("test");
        expect(lastname).toBe("user")
    });
    
})