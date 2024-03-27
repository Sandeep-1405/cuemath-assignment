const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);
let cursors;
let socket;

function preload() {
    this.load.image('rook', 'assets/rook.png');
}

function create() {
    cursors = this.input.keyboard.createCursorKeys();
    socket = io();

    socket.on('playerConnected', (player) => {
        console.log('Player connected:', player.id);
    });

    socket.on('playerMoved', (data) => {
        console.log('Player moved:', data.playerId, data.direction);
        // Update game state based on player move
    });

    socket.on('playerDisconnected', (playerId) => {
        console.log('Player disconnected:', playerId);
        // Handle player disconnect
    });

    // Add game objects, set up the game board, etc.
}

function update() {
    if (cursors.left.isDown) {
        socket.emit('move', 'left');
    } else if (cursors.down.isDown) {
        socket.emit('move', 'down');
    }
}
