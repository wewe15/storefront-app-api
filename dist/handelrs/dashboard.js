"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dashboard_1 = require("../services/dashboard");
const authentication_1 = __importDefault(require("../middlewares/authentication"));
const dashboard = new dashboard_1.DashboardQueries();
const usersWithOrders = async (_req, res) => {
    const users = await dashboard.usersWithOrders();
    res.json(users);
};
const productsInOrders = async (_req, res) => {
    const products = await dashboard.productsInOrders();
    res.json(products);
};
const dashboardRoutes = (app) => {
    app.get('/products_in_orders', authentication_1.default, productsInOrders);
    app.get('/users-with-orders', authentication_1.default, usersWithOrders);
};
exports.default = dashboardRoutes;
