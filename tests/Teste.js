import { Server } from "socket.io";
import http from "http";

const messagens = [];
const server = http.createServer();
const io = new Server(server,{
    cors: {
        origin: '*'
    }
});

io.on('connection',socket => {
    console.log("conectado");
    socket.on('message-client',function(message) {
        messagens.push(message)
        console.log(messagens);
        io.sockets.emit('messagens',message);
    });
    socket.emit('old-message',messagens);
});

server.listen(8081,() => {
    console.log("Server Running " + 8081);
});