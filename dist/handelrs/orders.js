"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const orders_1 = require("../models/orders");
const authentication_1 = __importDefault(require("../middlewares/authentication"));
const store = new orders_1.OrderModel();
const index = async (_req, res) => {
    const orders = await store.index();
    res.json(orders);
};
const show = async (req, res) => {
    const order = await store.show(req.body.id);
    res.json(order);
};
const create = async (req, res) => {
    try {
        const order = {
            id: req.body.id,
            user_id: req.body.user_id,
            status: req.body.status,
            products: req.body.products
        };
        const newOrder = await store.create(order);
        res.json(newOrder);
    }
    catch (err) {
        res.status(400).json(err);
    }
};
const addProduct = async (req, res) => {
    try {
        const orderProduct = {
            order_id: req.params.id,
            product_id: req.body.product_id,
            quantity: parseInt(req.body.quantity)
        };
        const newAddedProduct = await store.addProduct(orderProduct);
        res.json(newAddedProduct);
    }
    catch (err) {
        res.status(400).json(err);
    }
};
const destroy = async (req, res) => {
    const deleted = await store.delete(req.body.id);
    res.json(deleted);
};
const OrderRoutes = (app) => {
    app.get('/orders', index);
    app.get('orders/:id', show);
    app.post('/orders', authentication_1.default, create);
    app.post('/orders/:id/products', authentication_1.default, addProduct);
    app.delete('/orders', authentication_1.default, destroy);
};
exports.default = OrderRoutes;
