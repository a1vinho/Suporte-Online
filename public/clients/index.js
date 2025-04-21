import { io } from "https://cdn.socket.io/4.7.5/socket.io.esm.min.js";
const socket = io('https://192.168.1.81');

const send_message = document.querySelector('.send-message');
const input_message = send_message.querySelector('input');
const container_message = document.querySelector('.container-messagens');
let id_session;
input_message.addEventListener('input', function () {
    console.log(true)
    socket.emit('writing', id_session);
});
window.addEventListener("load", function () {
    container_message.scrollTop = container_message.scrollHeight;
});
send_message.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!input_message.value.trim()) return;
    const object_send = {
        message: input_message.value,
        id_session
    }
    socket.emit("message-client", object_send);
    socket.emit('request-messagens', object_send);
    input_message.value = '';
});
socket.on('session-id', function (sessionId) {
    id_session = sessionId;
});
socket.on('message', data => {
    const message_client = document.createElement('div');
    message_client.classList.add('messagens-client');
    message_client.innerHTML = `
        <p>${data.message}</p>
        <span class='date-message'>${new Date(data.date).toLocaleString()}</span>
    `;
    console.log(data);
    container_message.appendChild(message_client);
    container_message.scrollTop = container_message.scrollHeight;
});

socket.on('suport chat', data => {
    const message = document.createElement('div');
    message.classList.add('messagens');
    console.log(data);
    message.innerHTML = `
        <strong>${data.profile}</strong>
        <p>${data.message}</p>
    `;
    container_message.appendChild(message);
    container_message.scrollTop = container_message.scrollHeight;

});

function OldMessagens(data, classTag, estruct_html) {
    const joinArray = [...data.client, ...data.suport].sort((a, b) => {
        console.log(a, b)
        return a.date - b.date
    });
    let data_class = '';
    for (const msg of joinArray) {
        const message = document.createElement('div');
        msg.id_room ? data_class = 'messagens' : data_class = 'messagens-client';
        message.classList.add(data_class);
        message.innerHTML = `
            ${msg.id_room ? '<strong>Suporte</strong>' : ''}
            <div>
                <p>${msg.message}</p>
            </div>
            <span class="${data_class === 'messagens-client' ? 'date-message' : 'date-message-suport'}">${new Date(msg.date).toLocaleString()}</span>
        `;
        container_message.appendChild(message);
    };
    container_message.scrollTop = container_message.scrollHeight;
};
socket.on('old-messagens-user', (data) => OldMessagens(data, 'messagens', true));

const information_suport = document.querySelector('.information-suport');
const shadow = document.querySelector('.shadow');
document.querySelector('.menu-suport').addEventListener("click", function () {
    information_suport.style.display = 'block';
    shadow.style.display = 'block';
});

shadow.addEventListener('click', function () {
    shadow.style.display = 'none';
    information_suport.style.display = 'none';
});

socket.on("messagens-room", data => {
    const message = document.createElement('div');
    message.classList.add('messagens');
    const index_message = data.suport.length - 1;
    const last_message = data.suport[index_message];
    console.log(last_message)
    message.innerHTML = `
        <strong>Suporte</strong>
        <div>
            <p>${last_message.message}</p>
        </div>
        <span class='date-message-suport'>${new Date(last_message.date).toLocaleString()}</span>
    `;
    if (last_message.id_room === id_session) {
        container_message.appendChild(message);
    };
});