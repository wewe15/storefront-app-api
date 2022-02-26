"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const products_1 = require("../models/products");
const authentication_1 = __importDefault(require("../middlewares/authentication"));
const store = new products_1.ProductModel();
const index = async (_req, res) => {
    const products = await store.index();
    res.json(products);
};
const show = async (req, res) => {
    const product = await store.show(req.body.id);
    res.json(product);
};
const create = async (req, res) => {
    try {
        const product = {
            id: req.body.id,
            name: req.body.name,
            price: req.body.price
        };
        const newProduct = await store.create(product);
        res.json(newProduct);
    }
    catch (err) {
        res.status(400);
        res.json(err);
    }
};
const destroy = async (req, res) => {
    const deleted = await store.delete(req.body.id);
    res.json(deleted);
};
const productRoutes = (app) => {
    app.get('/products', index);
    app.get('/products/:id', show);
    app.post('/products', authentication_1.default, create);
    app.delete('/products', authentication_1.default, destroy);
};
exports.default = productRoutes;
