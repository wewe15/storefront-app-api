"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const orders_1 = require("../models/orders");
const users_1 = require("../models/users");
const products_1 = require("../models/products");
const database_1 = __importDefault(require("../database"));
const orderModel = new orders_1.OrderModel();
const userModel = new users_1.UserModel();
const productModel = new products_1.ProductModel();
describe('Test for order model', () => {
    it('should have an index order method', () => {
        expect(orderModel.index).toBeDefined();
    });
    it('should have an show order method', () => {
        expect(orderModel.show).toBeDefined();
    });
    it('should have an create order method', () => {
        expect(orderModel.create).toBeDefined();
    });
    it('should have an delete order method', () => {
        expect(orderModel.delete).toBeDefined();
    });
    it('should have an  addproduct method', () => {
        expect(orderModel.addProduct).toBeDefined();
    });
    const newuser = {
        username: 'testorder',
        firstname: 'test',
        lastname: 'user',
        password: 'passtest123'
    };
    const newproduct = {
        name: "newProduct",
        price: 40
    };
    const order = {
        status: "exist",
        user_id: newuser.id,
    };
    beforeAll(async () => {
        const createdUser = await userModel.create(newuser);
        newuser.id = createdUser.id;
        const createdProduct = await productModel.create(newproduct);
        newproduct.id = createdProduct.id;
        const createdOrder = await orderModel.create(order);
        order.id = createdOrder.id;
    });
    afterAll(async () => {
        const conn = await database_1.default.connect();
        const sql = 'ALTER SEQUENCE order_products_id_seq RESTART WITH 1; DELETE FROM order_products;\
                     ALTER SEQUENCE products_id_seq RESTART WITH 1; DELETE FROM products;\
                     ALTER SEQUENCE orders_id_seq RESTART WITH 1; DELETE FROM orders;\
                     ALTER SEQUENCE users_id_seq RESTART WITH 1; DELETE FROM users;';
        await conn.query(sql);
        conn.release();
    });
    it("should create new order", async () => {
        const newOrder = await orderModel.create({
            status: "available",
            user_id: newuser.id,
        });
        expect(newOrder.id).toEqual(newOrder.id);
        expect(newOrder.status).toEqual('available');
        expect(newOrder.user_id).toEqual("1");
    });
    it("should return all orders", async () => {
        const orders = await orderModel.index();
        expect(orders?.length).toBe(2);
    });
    it("should return order", async () => {
        const newOrder = await orderModel.show(order.id);
        expect(newOrder.id).toEqual(order.id);
        expect(newOrder.status).toEqual(order.status);
    });
    it("should add product to order", async () => {
        const newAddProduct = await orderModel.addProduct({
            product_id: newproduct.id,
            order_id: order.id,
            quantity: 40,
        });
        expect(newAddProduct.id).toEqual(newAddProduct.id);
        expect(newAddProduct.product_id).toEqual("1");
        expect(newAddProduct.order_id).toEqual("1");
        expect(newAddProduct.quantity).toEqual(40);
    });
    it("should delete order", async () => {
        const newOrder = await orderModel.create({
            status: "available",
            user_id: newuser.id,
        });
        let deletedOrder = await orderModel.delete(newOrder.id);
        expect(deletedOrder.id).toBe(newOrder.id);
    });
});
