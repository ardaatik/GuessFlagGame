"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const path_1 = __importDefault(require("path"));
const sockets_1 = __importDefault(require("./sockets"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// Serve static files from the React app
app.use((0, cors_1.default)({
    origin: process.env.NODE_ENV === "development" ? "http://localhost:3000" : "",
}));
app.use(express_1.default.static(path_1.default.join(__dirname, "../client-build")));
console.log(`Attempting to run server on port ${port}`);
const server = (0, http_1.createServer)(app);
(0, sockets_1.default)(server);
// Handles any requests that don't match the ones above
app.get("*", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "../client-build/index.html"));
});
