import { Order, OrderModel, OrderProduct } from "../models/orders";
import { User, UserModel } from "../models/users";
import { Product, ProductModel } from "../models/products";
import client from "../database";
import supertest from "supertest";
import app from "../server";


const orderModel = new OrderModel();
const userModel = new UserModel();
const productModel = new ProductModel();
const request = supertest(app);
let token = '';

describe('Test orders API endpoint', () => {
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

    const order = {
        status: "available",
        user_id: user.id
    } as Order

    beforeAll(async () => {
        const createdUser = await userModel.create(user);
        user.id = createdUser.id;
        const createdProduct = await productModel.create(product);
        product.id = createdProduct.id;
        const createdOrder = await orderModel.create(order);
        order.id = createdOrder.id;
    });

    afterAll(async () => {
        const conn = await client.connect();
        const sql = 'ALTER SEQUENCE order_products_id_seq RESTART WITH 1; DELETE FROM order_products;\
                     ALTER SEQUENCE products_id_seq RESTART WITH 1; DELETE FROM products;\
                     ALTER SEQUENCE orders_id_seq RESTART WITH 1; DELETE FROM orders;\
                     ALTER SEQUENCE users_id_seq RESTART WITH 1; DELETE FROM users;'
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

    it('should create new order', async () => {
        const res = await request
            .post('/orders')
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({
                status: "exist",
                user_id: user.id
            } as Order);
        expect(res.status).toBe(200);
        const {status, user_id} = res.body;
        expect(status).toBe("exist");
        expect(user_id).toBe("1");
    });

    it('should get list of orders', async () => {
        const res = await request
            .get('/orders')
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body.length).toBe(2);
    });

    it('should get order by id', async () => {
        const res = await request
            .get(`/orders/${order.id}`)
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
        expect(res.status).toBe(200);
        const {id, status} = res.body;
        expect(status).toBe("available");
        expect(id).toBe(1);
    });

    it('should add product to order', async () => {
        const res = await request
            .post(`/orders/${order.id}/products`)
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({
                product_id: product.id,
                quantity: 12
            } as OrderProduct);
        expect(res.status).toBe(200);
        const {product_id, quantity} = res.body;
        expect(product_id).toBe("1");
        expect(quantity).toBe(12);
    });

    it('should delete order by id', async () => {
        const newOrder = await orderModel.create({
            status: "available",
            user_id: user.id,
        } as Order);
        const res = await request
            .delete(`/orders/${newOrder.id}`)
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
        expect(res.status).toBe(200);
        const {id, status} = res.body;
        expect(id).toBe(newOrder.id)
        expect(status).toBe("available");
    });
})