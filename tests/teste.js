import { io } from "https://cdn.socket.io/4.7.5/socket.io.esm.min.js";

const socket = io('http://localhost:8081/');

const form = document.getElementById('form');
const input_message = form.querySelector('input');

form.addEventListener('submit',event => {
    event.preventDefault();
    if (input_message.value) {
        socket.emit('message-client',input_message.value);
    };
});
var messages = document.getElementById('messages');


function EmitMessage(event,callback) {
    socket.on(event,callback)
}
EmitMessage('messagens',data => {
    const li = document.createElement('li');
    li.textContent = data;
    messages.appendChild(li);
});
EmitMessage('old-message',data => {
    data.forEach(message => {
        const li = document.createElement('li');
        li.textContent = message;
        messages.appendChild(li);
    })
});