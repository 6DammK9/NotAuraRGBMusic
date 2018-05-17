'use strict';

const { AuraSDK, Controller } = require('aura-sdk')
const fs = require('fs');
const path = require('path');

const port = process.argv[2] || 9997;
const CLIENT_WEBPAGE = 'analyser.html';

const express = require('express');
const app = express();
const server = require('http').createServer(app)
const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, 'public')));
app.get('/', function (req, res) {
    res.redirect(`./${CLIENT_WEBPAGE}`);
});

io.on('connection', (socket) => {
    //console.log(socket)
    socket.on("aura", (data) => {
        //console.log(data);
        cur = data.map(i => i ? Math.round(i) : 0);
        //aurasync.forEach( led => led.setColor(`rgb(${cur[0]}, ${cur[1]}, ${cur[2]})`));
        //console.log(cur);
        fps_a++;
    });
});

const led_t = 100; //poll frequency in ms
const skip_everysent = 20;
let skip_counter = 0;
let fps_a = 0;
let aurasync = null;
let cur = [0, 0, 0];

const readaudio = () => {
    process.stdout.write(`fps_a=${Math.round(fps_a * 1000 / led_t)}, cur=${cur}         \r`);
    fps_a = 0;
    
    if (aurasync && skip_counter % skip_everysent)
        aurasync.forEach(led => led.setColorNow(`rgb(${cur[0]}, ${cur[1]}, ${cur[2]})`));
        //aurasync.forEach(led => led.setColorNow(`rgb(32,32,32)`));
    //aurasync.forEach( led => led.updateColor() );

    //cur = cur.map(i => i==128?255:128);
    skip_counter++;
    skip_counter %= skip_everysent;
};

const main = () => {
    let mbController = null;
    let gpuController = null;
    let dramController = null;
    let auraSDK = null;
    let found_devices = [];

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

        if (mbController)
            found_devices.push(mbController);
        if (gpuController)
            found_devices.push(gpuController);
        if (dramController)
            found_devices.push(dramController);

        aurasync = Controller.joinControllers(found_devices);
        //console.log(new Controller());
        aurasync.forEach(led => {
            console.log(led.getDeviceName());
        });

    } else {
        console.log("Server will not control RGB devices due to exception.");
    }

    server.listen(port);

    setInterval(readaudio, led_t);

    console.log(io ? `WS Server is running on port ${port}` : `WS Server is not started`);

};

main();
