import { io } from "https://cdn.socket.io/4.7.5/socket.io.esm.min.js";
import { container_messagens, CreateContainerRoom } from "./index.js";
const socket = io('https://192.168.1.81');
const form_send = document.querySelector('.send-messagens');
const input = form_send.querySelector('input');

export let id_session = '';
function SubmitFormSuport() {
    form_send.addEventListener('submit', event => {
        id_session = form_send.getAttribute('data-id');
        event.preventDefault();
        if (!input.value.trim()) return;
        const object_send = {
            message: input.value,
            id_room: id_session
        };
        socket.emit('suport-message', object_send);
        input.value = '';
    });
};

function GetRoom() {
    const room = document.querySelector(`[room-id="${id_session}"]`);
    return room;
};
function CreateMessageSuport(room, message) {
    const message_suport = document.createElement('div');
    message_suport.classList.add('message-suport');
    message_suport.innerHTML = `
        <div>
            <p>${message.message}</p>
        </div>
        <span class='date-message-suport'>${new Date(message.date).toLocaleString()}</span>
    `;
    room.appendChild(message_suport);
    container_messagens.appendChild(room);
};
socket.on('messagens-room', ({ client, suport }) => {
    if (!id_session) return;
    const last_message = suport[suport.length - 1];
    const room = GetRoom();
    CreateMessageSuport(room, last_message);
});
SubmitFormSuport();