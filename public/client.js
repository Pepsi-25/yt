const socket = io();
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');


let me = { x: 100, y: 100 };
let players = {};


window.addEventListener('keydown', e => {
if (e.key === 'ArrowUp') me.y -= 5;
if (e.key === 'ArrowDown') me.y += 5;
if (e.key === 'ArrowLeft') me.x -= 5;
if (e.key === 'ArrowRight') me.x += 5;
socket.emit('move', me);
});


socket.on('state', state => {
players = state;
});


function draw() {
ctx.clearRect(0,0,800,500);
for (let id in players) {
ctx.fillStyle = 'cyan';
ctx.beginPath();
ctx.arc(players[id].x, players[id].y, 10, 0, Math.PI*2);
ctx.fill();
}
requestAnimationFrame(draw);
}


draw();

const roomId = prompt('Enter room name:');
socket.emit('join-room', roomId);


/* =========================
STAGE 4 – USERNAME + AVATAR (Basic)
========================= */


const username = prompt('Your name:');


// send username with movement
socket.emit('user-info', { name: username });
