const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const httpProxy = require('http-proxy'); // Import the http-proxy library

const proxy = httpProxy.createProxyServer({});

const io = require("socket.io")(server, {
    cors: {
        origin: ["https://alann07as.github.io", "http://127.0.0.1:5500", "http://localhost:5500", "http://127.0.0.1:5500", "http://192.168.108.160:5500"],
        methods: ["GET", "POST"]
    }
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Create a route to proxy requests through the proxy server
app.get('/proxy', (req, res) => {
    // Here you can modify the proxy options as needed
    const proxyOptions = {
        target: {
            host: "www.google.com", // Replace with your proxy host
            port: 8080,
        },
    };
    proxy.web(req, res, proxyOptions);
});

io.on('connection', (socket) => {
    console.log('a user connected');
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});



// recuperer l'ip peutetre pour plus tard
// https://stackoverflow.com/questions/3653065/get-local-ip-address-in-node-js
'use strict';

const { networkInterfaces } = require('os');

const nets = networkInterfaces();
const results = Object.create(null); // Or just '{}', an empty object

for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
        // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
        // 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
        const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4
        if (net.family === familyV4Value && !net.internal) {
            if (!results[name]) {
                results[name] = [];
            }
            results[name].push(net.address);
        }
    }
}
console.log(results);