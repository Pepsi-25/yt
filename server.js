const express = require('express');
const http = require('http');
const { Server } = require('socket.io');


const app = express();
const server = http.createServer(app);
const io = new Server(server);


app.use(express.static('public'));


const users = {};


io.on('connection', socket => {
users[socket.id] = { x: 100, y: 100 };


socket.on('move', pos => {
users[socket.id] = pos;
io.emit('state', users);
});


socket.on('disconnect', () => {
delete users[socket.id];
io.emit('state', users);
});
});


server.listen(3000, () => {
console.log('SWAEB running on http://localhost:3000');
});