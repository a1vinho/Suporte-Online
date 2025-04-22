import { Server } from "socket.io";
import helmet from "helmet";
import cors from "cors";
import http from "http";
import session from "express-session";
import express from "express";
import { RedisStore } from "connect-redis"
import { createClient } from "redis";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import 'dotenv/config';

import Socket from "./code/socket.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const redisClient = createClient();
redisClient.connect().catch(console.error);
const app = express();
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", 'https://cdn.socket.io/4.7.5/socket.io.esm.min.js ']
        }
    }
}));
app.use(express.static('clients'));
app.use(express.static('admin'));
app.use(cors({
    origin: '*',
}));

app.use('/clients', express.static('public/clients'));
app.use('/admin', express.static('public/admin'));
const server = http.createServer(app);
const io = new Server(server, {
    transports: ["websocket"],
    cors: {
        origin: '*'
    }
});

const sessionMiddleware = session({
    secret: process.env.SECRET,
    store: new RedisStore({ client: redisClient }),
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 86400000,
        sameSite: "strict"
    }
});

app.use(sessionMiddleware);
io.engine.use(sessionMiddleware);
Socket(io, server);

app.use('/session-id', function (request, response) { return response.json(request.session.id) });
app.get('/', function (request, response) {
    return response.status(200).sendFile(path.join(__dirname, 'clients/index.html'));
});
app.get('/admin', function (request, response) {
    return response.status(200).sendFile(path.join(__dirname, 'admin/index.html'));
});

server.listen(8083, () => {
    console.log("Server Running " + 8083);
});