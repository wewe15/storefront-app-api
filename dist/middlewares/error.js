"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleErrors = void 0;
const handleErrors = (error, req, res, next) => {
    const status = error.status || 500;
    const message = error.message || 'something went wrong!!';
    res.status(status).json({ status, message });
};
exports.handleErrors = handleErrors;
exports.default = exports.handleErrors;
