import dotenv from 'dotenv';
dotenv.config()

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import routes from './routes/index';
// import { createServer } from 'http';
// import { Server,Socket } from 'socket.io'
import path from 'path';


//MiddleWare
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cors())
app.use(cookieParser())
app.use(morgan('dev'))

//Socket.io
// const http = createServer(app)
// export const io = new Server(http)
// import { SocketServer } from './config/socket'

// io.on("connection", (socket: Socket) => SocketServer(socket))

//Routes
app.use('/api', routes)


//Database
import './config/database';


//Production Deploy
if(process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'))
    app.get('*',(req,res) => {
        res.sendFile(path.join(__dirname, '..client', 'build', 'index.html'))
    });
};

//Server Listening
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log("The server is running on port",PORT)
})