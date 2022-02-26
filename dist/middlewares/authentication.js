"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const validateToken = (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization;
        const token = authorizationHeader.split(' ')[1];
        if (token) {
            const decode = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            if (decode) {
                next();
            }
            else {
                res.status(401);
                res.send('login Erorr: please try again');
            }
        }
        else {
            res.status(401);
            res.send('login Erorr: please try again');
        }
    }
    catch (err) {
        res.status(401);
        res.send('login Erorr: please try again');
        ;
    }
};
exports.default = validateToken;
