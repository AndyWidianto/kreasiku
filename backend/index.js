import express from 'express';
import cors from 'cors';
import routes from './router/routes.js';
import db from './config/db.js';
import cookieParser from 'cookie-parser';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { defineSocket } from './socket.js';



const app = express();
const server = new createServer(app);
app.use(cookieParser()).use(express.json()).use(cors({
    origin: 'http://localhost:5173',
    credentials: true
})).use(routes);


const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true
    }
});
defineSocket(io);
server.listen(3000, () => console.log("berjalan di localhost:3000"));