const express = require('express');
const cors = require('cors');
const http = require('http');
const {Server} = require('socket.io');

const app = express();

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);
    socket.on('disconnect', () => {
        console.log("A user disconnected");
    });
    socket.on('send_message', (data) => {
        socket.broadcast.emit('receive_message', data);
    });
    socket.on('user_update', (data) => {
        socket.broadcast.emit('receive_notice', data);
    })
});

server.listen(8000, () => {
    console.log('Server listening on PORT 8000');
});

