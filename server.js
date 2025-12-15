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
const rooms = {};


io.on('connection', socket => {
socket.on('join-room', roomId => {
socket.join(roomId);
if (!rooms[roomId]) rooms[roomId] = {};
rooms[roomId][socket.id] = { x: 100, y: 100 };
io.to(roomId).emit('state', rooms[roomId]);


socket.on('move', pos => {
rooms[roomId][socket.id] = pos;
io.to(roomId).emit('state', rooms[roomId]);
});


socket.on('disconnect', () => {
delete rooms[roomId][socket.id];
io.to(roomId).emit('state', rooms[roomId]);
});
});
});
