//https://stackoverflow.com/questions/10175812/how-to-generate-a-self-signed-ssl-certificate-using-openssl

const express = require('express');
const https = require('https'); // Use the 'https' module
const { Server } = require("socket.io");
var fs = require('fs');

const app = express();

// Load your SSL key and certificate
var options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
};

// Create an HTTPS server
const server = https.createServer(options, app);

const io = new Server(server, {
    cors: {
        origin: ["https://alann07as.github.io", "http://127.0.0.1:5500", "http://localhost:5500", "http://192.168.108.160:5500"],
        methods: ["GET", "POST"]
    }
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('a user connected');
});

server.listen(3000, () => {
    console.log('listening on *:3000');
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
console.log(results);
