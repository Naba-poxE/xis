"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const index_1 = __importDefault(require("./routes/index"));
// import { createServer } from 'http';
// import { Server,Socket } from 'socket.io'
const path_1 = __importDefault(require("path"));
//MiddleWare
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cors_1.default)());
app.use((0, cookie_parser_1.default)());
app.use((0, morgan_1.default)('dev'));
//Socket.io
// const http = createServer(app)
// export const io = new Server(http)
// import { SocketServer } from './config/socket'
// io.on("connection", (socket: Socket) => SocketServer(socket))
//Routes
app.use('/api', index_1.default);
//Database
require("./config/database");
//Production Deploy
if (process.env.NODE_ENV === 'production') {
    app.use(express_1.default.static('client/build'));
    app.get('*', (req, res) => {
        res.sendFile(path_1.default.join(__dirname, '..client', 'build', 'index.html'));
    });
}
;
//Server Listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log("The server is running on port", PORT);
});
