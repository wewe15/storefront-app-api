"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const products_1 = require("../models/products");
const users_1 = require("../models/users");
const database_1 = __importDefault(require("../database"));
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../server"));
const productModel = new products_1.ProductModel();
const userModel = new users_1.UserModel();
const request = (0, supertest_1.default)(server_1.default);
let token = '';
describe('Test products API endpoint', () => {
    const product = {
        name: "book",
        price: 30
    };
    const user = {
        username: 'testuser',
        firstname: 'test',
        lastname: 'user',
        password: 'passtest123'
    };
    beforeAll(async () => {
        const createdUser = await userModel.create(user);
        user.id = createdUser.id;
        const createdProduct = await productModel.create(product);
        product.id = createdProduct.id;
    });
    afterAll(async () => {
        const conn = await database_1.default.connect();
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
        const { id, username, token: userToken } = res.body;
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
        });
        expect(res.status).toBe(200);
        const { name, price } = res.body;
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
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        const { name, price } = res.body;
        expect(name).toBe("book");
        expect(price).toBe(30);
    });
    it('should delete product by id', async () => {
        const res = await request
            .delete(`/products/${product.id}`)
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        const { id, name, price } = res.body;
        expect(id).toBe(product.id);
        expect(name).toBe("book");
        expect(price).toBe(30);
    });
});
