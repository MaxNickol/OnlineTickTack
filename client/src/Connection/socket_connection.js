import io from 'socket.io-client';

const socket = io.connect('https://guarded-wave-01892.herokuapp.com');
socket.on('connect', () => {});

export default socket;