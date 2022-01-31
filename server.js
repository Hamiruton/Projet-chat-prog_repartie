const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const {v4: uuidv4} = require('uuid');
const formatMessage = require('./utils/messages');
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utils/user');
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
    debug: true,
});
const botName = 'ChatBot';

app.use("/peerjs", peerServer);
app.set('view engine', 'ejs');
app.set('views', 'public/views');
app.use(express.static(path.join(__dirname, 'public')));

room = path.join(__dirname, 'public', 'room.html')

// Charger quand le client lance l'URL
app.get('/', (req, res)=>{
    res.render('index.ejs');
})

app.get('/chat', (req, res)=>{
    res.render('chat.ejs')
})
io.on('connection', socket => {
    socket.on('joinRoom', ({username, room}) => {
        const user = userJoin(socket.id, username, room);

        socket.join(user.room);

        // Message du serveur de bien arrivé au new user
        socket.emit('message', formatMessage(botName, 'Bienvenue dans notre groupe de chat'));

        // Notifier aux autres users du même salon que quelqu'un de nouveau est dans le groupe
        socket.broadcast
            .to(user.room)
            .emit('message', formatMessage(botName, `${user.username} a rejoint la discussion`));
        
        // Renvoyer les infos d'un salon
        io.to(user.room).emit('roomUsers', {room: user.room, users: getRoomUsers(user.room)});
        
    });
    

    // Ecouter l'event chatMessage
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);

        io
            .to(user.room)
            .emit('message', formatMessage(`${user.username}`, msg));
    });

    // Video chat
    socket.on('video-chat', (roomId, userId, username)=>{
        socket.join(roomId);
        socket.broadcast.to(roomId).emit("user-connected", userId);
        socket.on("message", (message) => {
            io.to(roomId).emit("createMessage", message, username);
        });
    })
    

    // Charger quand le client se déconnecte
    socket.on('disconnect', ()=>{
        const user = userLeave(socket.id);

        if (user) {
            io
            .to(user.room)
            .emit('message', formatMessage(botName, `${user.username} est parti(e)`));

            // Renvoyer les infos d'un salon
            io.to(user.room).emit('roomUsers', {room: user.room, users: getRoomUsers(user.room)});

        }
    });
});

app.get('/room', (req, res)=>{
    res.redirect(`room/${uuidv4()}`);
})

app.get('/room/:id', (req,res)=>{
    res.render('room.ejs', { roomId: req.params.id })
})

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));