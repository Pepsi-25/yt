const peers = {};
let localStream;


async function initAudio() {
localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
}


socket.on('state', users => {
for (let id in users) {
if (id === socket.id) continue;
if (!peers[id]) createPeer(id, true);
}
});


function createPeer(id, initiator) {
const pc = new RTCPeerConnection({
iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
});


localStream.getTracks().forEach(t => pc.addTrack(t, localStream));


pc.ontrack = e => {
const audio = document.createElement('audio');
audio.srcObject = e.streams[0];
audio.autoplay = true;
audio.dataset.id = id;
document.body.appendChild(audio);
};


pc.onicecandidate = e => {
if (e.candidate) socket.emit('ice', { to: id, candidate: e.candidate });
};


if (initiator) {
pc.createOffer().then(o => pc.setLocalDescription(o));
pc.onnegotiationneeded = () => {
socket.emit('offer', { to: id, offer: pc.localDescription });
};
}


peers[id] = pc;
}


socket.on('offer', async ({ from, offer }) => {
const pc = createPeer(from, false);
await peers[from].setRemoteDescription(offer);
const ans = await peers[from].createAnswer();
await peers[from].setLocalDescription(ans);
socket.emit('answer', { to: from, answer: ans });
});


socket.on('answer', ({ from, answer }) => {
peers[from].setRemoteDescription(answer);
});


socket.on('ice', ({ from, candidate }) => {
peers[from].addIceCandidate(candidate);
});


/* -------- SPATIAL AUDIO UPDATE -------- */


function updateVolumes(players) {
for (let id in players) {
if (id === socket.id) continue;
const audio = document.querySelector(`audio[data-id='${id}']`);
if (!audio) continue;
const dx = players[id].x - me.x;
const dy = players[id].y - me.y;
const dist = Math.sqrt(dx*dx + dy*dy);
audio.volume = Math.max(0, 1 - dist / 200);
}
}

