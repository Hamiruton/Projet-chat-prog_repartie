const chatForm = document.getElementById('chat-form');
const chatMessage = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const leaveButton = document.getElementById('leave-btn');
const callbutton = document.getElementById('call-btn');

// Obtenir le username et le room à partir de l'URL
const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true

})

// console.log(username, room);

const socket = io();


// Rejoindre le chat
socket.emit('joinRoom', {username, room});


// Obtenir les infos users et room
socket.on('roomUsers', ({room, users}) => {
    outpuRoomName(room);
    outputUsers(users);
})

// Afficher les différents messages venant du server
socket.on('message', message => {
    console.log(message);

    outputMessage(message);

    chatMessage.scrollTop = chatMessage.scrollHeight;
});

// Valider les messages 
chatForm.addEventListener('submit', e => {
    e.preventDefault();

    // Get message text
    const msg = e.target.elements.msg.value;


    // Envoyer un message au server
    socket.emit('chatMessage', msg);

    // Nettoyer le formulaire
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

// Afficher les messages dans le DOM
function outputMessage(msg) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta"> ${msg.usrname} <span>${msg.time}</span></p>
    <p class="text">
        ${msg.text}
    </p>`;
    chatMessage.appendChild(div);
}

// Afficher le nom du salon dans le DOM
function outpuRoomName(room) {
    roomName.innerText = room;
}

// Ajouter les users connectés dans le DOM
function outputUsers(users) {
    userList.innerHTML = '';
    users.forEach((user)=> {
        const li = document.createElement('li');
        li.innerText = user.username;
        userList.appendChild(li);
    })
}

leaveButton.addEventListener('click', () => {
    const leaveRoom = confirm('Veux-tu vraiment quitter le chat ??');

    if (leaveRoom) {
        window.location = '/';
    }
});

callbutton.addEventListener('click', () => {
    window.location = '/room';
});

