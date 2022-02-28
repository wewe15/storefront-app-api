import { Product, ProductModel } from "../models/products";
import { User, UserModel } from "../models/users";
import client from "../database";
import supertest from "supertest";
import app from "../server";


const productModel = new ProductModel();
const userModel = new UserModel();
const request = supertest(app)
let token = '';

describe('Test products API endpoint', () => {
    const product = {
        name: "book",
        price: 30
    } as Product

    const user = {
        username: 'testuser',
        firstname: 'test',
        lastname: 'user',
        password: 'passtest123'
    } as User

    beforeAll(async () => {
        const createdUser = await userModel.create(user);
        user.id = createdUser.id;
        const createdProduct = await productModel.create(product);
        product.id = createdProduct.id
    });

    afterAll(async () => {
        const conn = await client.connect();
        const sql = 'ALTER SEQUENCE users_id_seq RESTART WITH 1; DELETE FROM users;\
                     ALTER SEQUENCE products_id_seq RESTART WITH 1; DELETE FROM products;';
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

    it('should create new product', async () => {
        const res = await request
            .post('/products')
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: "testBook",
                price: 40
            } as Product);
        expect(res.status).toBe(200);
        const {name, price} = res.body;
        expect(name).toBe("testBook");
        expect(price).toBe(40);
    });

    it('should get list of products', async () => {
        const res = await request
            .get('/products')
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body.length).toBe(2);
    });

    it('should get product by id', async () => {
        const res = await request
            .get(`/products/${product.id}`)
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
        expect(res.status).toBe(200);
        const {name, price} = res.body;
        expect(name).toBe("book");
        expect(price).toBe(30);
    });

    it('should delete product by id', async () => {
        const res = await request
            .delete(`/products/${product.id}`)
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
        expect(res.status).toBe(200);
        const {id, name, price} = res.body;
        expect(id).toBe(product.id)
        expect(name).toBe("book");
        expect(price).toBe(30);
    });
})