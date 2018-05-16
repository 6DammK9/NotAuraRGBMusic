'use strict';

const { AuraSDK } = require('aura-sdk')
const fs = require('fs');
const path = require('path');

const port = process.argv[2] || 9997;
const CLIENT_WEBPAGE = 'analyser.html';

const handler = (req, res) => {
    fs.readFile(path.join(__dirname, CLIENT_WEBPAGE), (err, data) => {
        if (err) {
            res.writeHead(500);
            return res.end(err.toString());
        }
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(data);
    });
};

const app = require('http').createServer(handler)
const io = require('socket.io')(app);

io.on('connection', (socket) => {
    //console.log(socket)
    socket.on("aura", (data) => {
        //console.log(data);
        cur = data.map(i => i ? Math.round(i) : 0);
        //console.log(cur);
    });
});

let auraSDK = null;
let mbController = null;
let gpuController = null;
let dramController = null;
let cur = [0, 0, 0];

const readaudio = () => {
    if (gpuController) {
        gpuController.setAllColorNow(`rgb(${cur[0]}, ${cur[1]}, ${cur[2]})`)
    }
};

const main = () => {
    try {
        auraSDK = new AuraSDK()
    } catch (e) { console.log(e.toString()); }
    if (auraSDK) {
        try {
            mbController = auraSDK.createMbController();
        } catch (e) { console.log(e); }
        try {
            gpuController = auraSDK.createGPUController();
        } catch (e) { console.log(e); }
        try {
            dramController = auraSDK.createDramController();
        } catch (e) { console.log(e); }
    } else {
        console.log("Server will not control RGB devices due to exception.");   
    }

    app.listen(port);

    setInterval(readaudio, 100);

    console.log(io ? `WS Server is running on port ${port}` : `WS Server is not started`);

};

main();
