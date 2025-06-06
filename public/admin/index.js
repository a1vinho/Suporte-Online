import { io } from "https://cdn.socket.io/4.7.5/socket.io.esm.min.js";
import { id_session } from "./suport.js";
const container_contacts = document.querySelector('.contacts-suport-left');
const container_right = document.querySelector('.container-suport-right');
export const container_messagens = document.querySelector('.messagens');
const right_messagens_container = document.querySelector('.container-messagens-right');
const form_send = document.querySelector('.send-messagens');

export let id_click = '';
socket.on('request-messagens');
// termina de finalizar a abertura das mensagens para que funcione corretamente.

function RenderMessagens(session_id, joinArray, room_message) {
    let data_class = '';
    for (const msg of joinArray) {
        console.log(msg);
        const message = document.createElement('div');
        msg.id_room ? data_class = 'message-suport' : data_class = 'message-client';
        message.classList.add(data_class);
        message.innerHTML = `
            ${!msg.id_room ? `<strong>${session_id}</strong>` : ''}
            <div>
                <p>${msg.message}</p>
            </div>
            <span class="${data_class === 'message-suport' ? 'date-message-suport' : 'date-message-client'}">${new Date(msg.date).toLocaleString()}</span>
        `;
        room_message.appendChild(message);
    };
    return room_message;
}
function MessagensLoopSend(session_id, data) {
    const room_message = CreateContainerRoom(session_id);
    const joinArray = [...data[session_id].client, ...data[session_id].suport].sort((a, b) => a.date - b.date);
    const messagens = RenderMessagens(session_id, joinArray, room_message);
    container_messagens.appendChild(messagens);
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
        id_click = session_id;
        form_send.setAttribute('data-id', id_click);
        socket.emit('id_client', id_click);
        MessagensLoopSend(id_click, data);
        console.log(id_click, id_session);
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
socket.on('sessions-messagens', data => FunctionObjectContact(data));
socket.on('old-messagens-suport', data => FunctionObjectContact(data));

socket.on('room-chat', ({ messagens, session_id }) => {
    let data_class = '';
    const room = CreateContainerRoom(session_id);
    const message = document.createElement('div');
    const joinArray = [...messagens.client, ...messagens.suport].sort((a, b) => a.date - b.date);
    const last_message = joinArray[joinArray.length - 1];
    last_message.id_room ? data_class = 'message-suport' : data_class = 'message-client';
    message.classList.add(data_class);

    message.innerHTML = `
        ${data_class === 'message-suport' ? '' : `<strong>${session_id}</strong>`}
        <div>
            <p>
                ${last_message.message}
            </p>
        </div>
        <span class="${data_class === 'message-suport' ? 'date-message-suport' : 'date-message-client'}">${new Date(last_message.date).toLocaleString()}</span>
    `;
    if (last_message.sessionId === id_click || last_message.id_room === id_click) {
        room.appendChild(message);
        right_messagens_container.scrollTop = right_messagens_container.scrollHeight;
    }
});

socket.on('writing',(data) => {
    console.log(data)
    const room = CreateContainerRoom(data.id_session);
    let writing = room.querySelector('.writing');
    if (!writing) {
        writing = document.createElement('div');
    }
    console.log(writing);
    if (!room.childNodes[1] && data.text) {
        writing.classList.add('writing');
        writing.textContent = 'Escrevendo...';
        room.appendChild(writing);
    }
    if (!data.text.trim() && room.childNodes[1]) {
        room.removeChild(writing);
    }
});
socket.on('writing-key',data => {
    console.log(data);
    const room = CreateContainerRoom(data.id_session);
    const writing = room.querySelector('.writing');
    if (writing || !data.text.trim()) {
        console.log(writing);
        room.removeChild(writing);
    };
});