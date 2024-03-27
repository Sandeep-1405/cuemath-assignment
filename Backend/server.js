const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));

let players = {};
let turn = 0; // Player 1 starts first

io.on('connection', socket => {
    console.log('New player connected:', socket.id);

    // Add new player to the game
    players[socket.id] = {
        id: socket.id,
        turn: Object.keys(players).length + 1 // Assign turn number
    };

    // Notify all players about the new player
    io.emit('playerConnected', players[socket.id]);

    // Handle player move
    socket.on('move', (direction) => {
        if (turn === players[socket.id].turn) {
            // Broadcast move to all players
            io.emit('playerMoved', { playerId: socket.id, direction });
            
            // Switch turn
            turn = (turn % 2) + 1;
        }
    });

    // Handle player disconnect
    socket.on('disconnect', () => {
        console.log('Player disconnected:', socket.id);
        delete players[socket.id];
        io.emit('playerDisconnected', socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
