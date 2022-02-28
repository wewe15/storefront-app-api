"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const users_1 = require("../models/users");
const authentication_1 = __importDefault(require("../middlewares/authentication"));
dotenv_1.default.config();
const store = new users_1.UserModel();
const index = async (_req, res) => {
    const users = await store.index();
    res.json(users);
};
const show = async (req, res) => {
    const user = await store.show(req.params.id);
    res.json(user);
};
const create = async (req, res) => {
    try {
        const user = {
            id: req.body.id,
            username: req.body.username,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            password: req.body.password,
        };
        const newUser = await store.create(user);
        res.json(newUser);
    }
    catch (err) {
        res.status(400);
        res.json(err);
    }
};
const authenticate = async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const user = await store.authenticate(username, password);
        const token = jsonwebtoken_1.default.sign({ user }, process.env.JWT_SECRET);
        if (!user) {
            return res.status(401).json({ status: 'error', message: 'the username or password do not match.' });
        }
        res.json({ ...user, token });
    }
    catch (err) {
        res.status(400);
        res.json(err);
    }
};
const destroy = async (req, res) => {
    const deleted = await store.delete(req.params.id);
    res.json(deleted);
};
const userRoutes = (app) => {
    app.get('/users', authentication_1.default, index);
    app.get('/users/:id', authentication_1.default, show);
    app.post('/users', create);
    app.delete('/users/:id', authentication_1.default, destroy);
    app.post('/users/authenticate', authenticate);
};
exports.default = userRoutes;
