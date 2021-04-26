"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path = require('path');
const app = express_1.default();
app.use(express_1.default.json());
app.use(express_1.default.static(path.join(__dirname, '../build')));
app.use('/api', require('./routes/v1'));
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, '../build/', "index.html"));
});
exports.default = app;
