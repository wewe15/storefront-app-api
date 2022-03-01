import { UserModel, User } from "../models/users";
import client from "../database";


const userModel = new UserModel();

describe('Test for user model', () => {
    it('should have an authenticate user method', () => {
        expect(userModel.authenticate).toBeDefined();
    });

    it('should have an index user method', () => {
        expect(userModel.index).toBeDefined();
    });

    it('should have an show user method', () => {
        expect(userModel.show).toBeDefined();
    });

    it('should have an create user method', () => {
        expect(userModel.create).toBeDefined();
    });

    it('should have an delete user method', () => {
        expect(userModel.delete).toBeDefined();
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

    it('Authenticate method should return authenticated user', async () => {
        const authenticate = await userModel.authenticate(
            user.username,
            user.password,
        );
        expect(authenticate?.username).toBe(user.username);
        expect(authenticate?.firstname).toBe(user.firstname);
        expect(authenticate?.lastname).toBe(user.lastname);
    });

    it('Authenticate method return null with wrong user', async () => {
        const authenticate = await userModel.authenticate(
            'Wrongusername',
            'Wrongpassword'
        );
        expect(authenticate).toBe(null);
    });

    it("should create new user", async () => {
        const newUser = await userModel.create({
            username: 'testuser2',
            firstname: 'test',
            lastname: 'user',
            password: 'passtest123'
        } as User);
        expect(newUser.id).toEqual(newUser.id);
        expect(newUser.firstname).toEqual('test');
        expect(newUser.lastname).toEqual('user');
        expect(newUser.username).toEqual('testuser2');
    });
    
    it("should return all users", async () => {
        const users = await userModel.index()
        expect(users?.length).toBe(2);
    });
    
    it("should return user", async () => {
        const newUser = await userModel.show(user.id as string)
        expect(newUser?.id).toEqual(user.id);
        expect(newUser.firstname).toEqual(user.firstname);
        expect(newUser.lastname).toEqual(user.lastname);
        expect(newUser.username).toEqual(user.username);
    });
    
    it("should delete user", async () => {
        let deletedUser = await userModel.delete(user.id as string);
        expect(deletedUser.id).toBe(user.id);
    });

})