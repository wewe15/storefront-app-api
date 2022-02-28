"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const users_1 = __importDefault(require("./handelrs/users"));
const products_1 = __importDefault(require("./handelrs/products"));
const orders_1 = __importDefault(require("./handelrs/orders"));
const dashboard_1 = __importDefault(require("./handelrs/dashboard"));
const error_1 = __importDefault(require("./middlewares/error"));
const app = (0, express_1.default)();
const address = "0.0.0.0:3000";
app.use(body_parser_1.default.json());
app.use(error_1.default);
app.get('/', function (req, res) {
    res.send('Hello World!');
});
(0, users_1.default)(app);
(0, products_1.default)(app);
(0, orders_1.default)(app);
(0, dashboard_1.default)(app);
app.use((_req, res) => {
    res.status(404).json({ message: 'oh you are lost.' });
});
app.listen(3000, function () {
    console.log(`starting app on: ${address}`);
});
exports.default = app;
