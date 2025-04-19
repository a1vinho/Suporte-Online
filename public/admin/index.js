import { io } from "https://cdn.socket.io/4.7.5/socket.io.esm.min.js";
const socket = io('https://192.168.1.81');

const container_contacts = document.querySelector('.contacts-suport-left');
const container_right = document.querySelector('.container-suport-right');
export const container_messagens = document.querySelector('.messagens');
const form_send = document.querySelector('.send-messagens');

export let id_click = '';
socket.on('request-messagens');
// termina de finalizar a abertura das mensagens para que funcione corretamente.
function MessagensLoopSend(session_id, array_msg) {
    const room_message = CreateContainerRoom(session_id);
    if (!Array.isArray(array_msg)) {
        return console.log('Esse contanto não tem nenhuma mensagem');
    };
    array_msg.forEach(msg => {
        const message = document.createElement('div');
        message.classList.add('message-client');
        message.innerHTML = `
            <div>
                <strong>${session_id}</strong>
                <p>${msg.message}</p>
            </div>
            <span class='date-message-client'>${new Date(msg.date).toLocaleString()}</span>
        `;
        room_message.appendChild(message);
    });
    container_messagens.appendChild(room_message);
};

export function CreateContainerRoom(session_id) {
    let room_message = document.querySelector(`[room-id="${session_id}"]`);
    if (!room_message && session_id) {
        room_message = document.createElement('div');
        room_message.classList.add('room-message', session_id);
        room_message.setAttribute('room-id', session_id);
    };
    return room_message;
};
function OpenMessageContact(session_id, data) {
    const contact = ExistsContactLeft(session_id);
    if (!contact) return;
    // if (id_atual !== session_id) console.log(session_id,id_atual);
    contact.addEventListener('click', function () {
        container_messagens.innerHTML = '';
        container_right.style.display = 'block';
        contact.style.background = 'black';
        contact.style.color = 'white';
        id_click = session_id;
        form_send.setAttribute('data-id',id_click);
        socket.emit('id_client', id_click);
        MessagensLoopSend(id_click, data[id_click].client);
    });
};

function ExistsContactLeft(session_id) {
    const contact = document.querySelector(`[data-id="${session_id}"]`);
    return contact;
};
function CreaterContactLeft(session_id) {
    const teste = document.createElement('div');
    teste.textContent = teste;
    const exists = ExistsContactLeft(session_id);
    const room = CreateContainerRoom(session_id);
    if (exists) return;
    const contact = document.createElement('div');
    contact.classList.add('contact');
    contact.setAttribute('data-id', session_id);
    contact.classList.add(session_id);
    const div_id = document.createElement('div');
    div_id.classList.add('session-id');
    const p = document.createElement('p');
    p.textContent = session_id;
    div_id.appendChild(p);
    contact.appendChild(div_id);

    container_messagens.appendChild(room);
    container_contacts.appendChild(contact);
};
function ViewEndMessageContact(session_id, data) {
    const contact = ExistsContactLeft(session_id);
    let message = document.querySelector(`[message-session-id="${session_id}"]`);
    if (!contact) return;
    const index_last = data[session_id].client.length - 1
    const last_message = data[session_id].client[index_last];
    if (!message) {
        message = document.createElement('div');
        message.classList.add('message');
        message.setAttribute('message-session-id', session_id);
        const div_message = document.createElement('div');
        const p = document.createElement('p');
        const span_length = document.createElement('span');
        span_length.classList.add('message-length');
        p.textContent = last_message.message;
        span_length.textContent = data[session_id].client.length;
        div_message.appendChild(p);
        div_message.appendChild(span_length);
        message.appendChild(div_message);
        contact.appendChild(message);
    };
    const p = message.querySelector('p');
    const span_length = message.querySelector('span');
    p.textContent = last_message.message;
    span_length.textContent = data[session_id].client.length;
};


function FunctionObjectContact(data) {
    Object.keys(data).forEach(id => {
        if (data[id].client.length > 0) {
            CreaterContactLeft(id);
            ViewEndMessageContact(id, data);
            OpenMessageContact(id, data);
        };
    });
};
// function ViewMessagensContact(session_id, data) {
//     if (!session_id) return;
//     const room_message = CreateContainerRoom(session_id);
//     const message = document.createElement('div');
//     message.classList.add('message-client');
//     const index_last = data[session_id].client.length - 1
//     const last_message = data[session_id].client[index_last];
//     message.innerHTML = `
//         <div>
//             <strong>${session_id}</strong>
//             <p>${last_message.message}</p>
//         </div>
//         <span class='date-message-client'>${new Date(last_message.date).toLocaleString()}</span>
//     `;
//     if (session_id !== id_click) {
//         return console.log('Div não adicionada');
//     };
//     room_message.appendChild(message);
//     container_messagens.appendChild(room_message);
//     console.log(container_messagens);
// };
socket.on('sessions-messagens', data => FunctionObjectContact(data));
socket.on('old-messagens-suport', data => FunctionObjectContact(data));

socket.on('room-chat', data => {
    const room = CreateContainerRoom(id_click);
    const message = document.createElement("div");
    message.classList.add('message-client', id_click);
    const index_last = data.client.length - 1;
    const last_message = data.client[index_last];
    message.innerHTML = `
        <div>
            <strong>${id_click}</strong>
            <p>${last_message.message}</p>
            </div>
            <span class='date-message-client'>${new Date(last_message.date).toLocaleString()}</span>
        `;
    const contact_click = ExistsContactLeft(id_click);
    if (last_message.sessionId === id_click) {
        room.appendChild(message);
        container_messagens.appendChild(room);
    };
});