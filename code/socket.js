import { XssSanitizer } from "./functions.js";

const sessions_id = {};

export default function (io, server) {
    io.on("connection", function (socket) {
        const sessionId = socket.request.session.id;
        socket.join(sessionId);
        if (!sessions_id[sessionId]) sessions_id[sessionId] = {
            client: [],
            suport: []
        };
        socket.emit('suport chat', {
            profile: "Suporte",
            message: "Bem vindo ao suporte do <strong>Suporte</strong>,como podemos lhe ajuda ? :D"
        });
        // socket.emit('sessions-messagens', sessions_id);
        socket.emit('session-id', sessionId);
        socket.on('message-client', async data => {
            if (!data.message) return;
            const date = Date.now();
            data.date = date;

            const sanitize = XssSanitizer(data.message);
            sessions_id[sessionId].client.push({
                date,
                message: sanitize,
                sessionId
            });
            data.message = sanitize;
            socket.emit("room-chat",sessions_id[data.id_session]);
            socket.emit('message',data);
            io.emit('room-chat',{
                messagens:sessions_id[data.id_session],
                session_id:data.id_session
            });
            socket.emit('sessions-messagens', sessions_id);
        });
        socket.emit('old-messagens-user', sessions_id[sessionId]);
        socket.emit('old-messagens-suport',sessions_id);
        // socket.emit('old-messagens-suport', sessions_id);
        socket.on('suport-message',data => {
            const suport_messagens = sessions_id[data.id_room].suport;
            suport_messagens.push({
                message: data.message,
                date: Date.now(),
                id_room: data.id_room
            });
            io.emit('room-chat',{
                messagens:sessions_id[data.id_room],
                session_id:data.id_room
            });
            io.emit('messagens-room',sessions_id[data.id_room]);
        });
        // socket.on('session-id',id => {
        //     console.log(id);
        //     io.to(id).emit('private-message',sessions_id[id][sessions_id[id].length - 1]);
        // });
        socket.on('request-messagens', function (data) {
            console.log(sessionId)
            io.emit('sessions-messagens', sessions_id);
        });
        socket.on("writing", data => {
            console.log('escrevendo...', data);
            io.emit('writing', data);
        });
        socket.on('writing-key',data => {
            io.emit('writing-key',data);
        });
    });
};