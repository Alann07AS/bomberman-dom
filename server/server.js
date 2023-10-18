
const express = require('express');
const https = require('https'); // Use the 'https' module
const { Server } = require("socket.io");
var fs = require('fs');

const app = express();

let wall_matrix = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 2, 2, 2, 2, 2, 2, 2, 0, 0, 1],
    [1, 0, 1, 2, 1, 2, 1, 2, 1, 2, 1, 0, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 0, 1, 2, 1, 2, 1, 2, 1, 2, 1, 0, 1],
    [1, 0, 0, 2, 2, 2, 2, 2, 2, 2, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
]

wall_matrix = wall_matrix.map(li => li.map(w => w === 2 ? (Math.random() > 0.3) ? 3 : 4 : w))

// Load your SSL key and certificate
//https://stackoverflow.com/questions/10175812/how-to-generate-a-self-signed-ssl-certificate-using-openssl
var options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
};

// Create an HTTPS server
const server = https.createServer(options, app);

const io = new Server(server, {
    cors: {
        origin: ["https://alann07as.github.io", "http://127.0.0.1:5500", "http://localhost:5500", "http://192.168.101.21:5500"],
        methods: ["GET", "POST"]
    }
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

const game = {
    players: [],
    walls: wall_matrix,
}

io.on('connection', (socket) => {
    console.log('a user connected');

    // demande de mise a jour de l'integriter du game obj
    socket.on("game", (walls) => {
        socket.emit("game", game)
    })

    //un player rejoin un slot
    socket.on("addplayer", (player) => {
        if (game.players.some(p => p.id === player.id)) return
        player.socketid = socket.id //relit le player au socket id
        game.players.push(player)
        io.emit("addplayer", game)
    })
    //update player pos
    socket.on("playerpos", (playerid, x, y) => {
        socket.broadcast.emit("playerpos", playerid, x, y) //met a jour chez tout les client
        game.players[playerid].position.x = x //met a jour sur le serveur
        game.players[playerid].position.y = y
    })

    //update ui player
    socket.on("ui", (player, playerid) => {
        socket.broadcast.emit("ui", player, playerid) //met a jour chez tout les client
        game.players[playerid] = player //met a jour sur le serveur
    })

    //update bomb player
    socket.on("bomb", (pid, bid, timestamp) => {
        socket.broadcast.emit("bomb", pid, bid, timestamp) //met a jour chez tout les client
        // game.players[playerid] = player //met a jour sur le serveur
    })

});


// Retrieve local IP addresses
const { networkInterfaces } = require('os');
const nets = networkInterfaces();
const results = Object.create(null);

for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
        const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4;
        if (net.family === familyV4Value && !net.internal) {
            if (!results[name]) {
                results[name] = [];
            }
            results[name].push(net.address);
        }
    }
}
console.log(Object.values(results)[0][0]);

server.listen(3000, () => {
    console.log(`listening on https://${Object.values(results)[0][0]}:3000`);
});