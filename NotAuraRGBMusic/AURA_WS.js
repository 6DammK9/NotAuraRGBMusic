'use strict';
const fs = require('fs');
const path = require('path');

const p_logiled = require("./server_modules/p_logiled");
const aura_sync = require("./server_modules/aura_sync");

const port = process.argv[2] || 9997;
const CLIENT_WEBPAGE = 'analyser.html';

const express = require('express');
const app = express();
const server = require('http').createServer(app)
const io = require('socket.io')(server);

const arraysEqual = (a, b) => {
    /*
        Array-aware equality checker:
        Returns whether arguments a and b are == to each other;
        however if they are equal-lengthed arrays, returns whether their 
        elements are pairwise == to each other recursively under this
        definition.
    */
    if (a instanceof Array && b instanceof Array) {
        if (a.length != b.length)  // assert same length
            return false;
        for (var i = 0; i < a.length; i++)  // assert each element equal
            if (!arraysEqual(a[i], b[i]))
                return false;
        return true;
    } else {
        //console.log({a,b});
        return a == b;  // if not both arrays, should be the same
    }
}

app.use(express.static(path.join(__dirname, 'public')));
app.get('/', function (req, res) {
    res.redirect(`./${CLIENT_WEBPAGE}`);
});

io.on('connection', (socket) => {
    //console.log(socket)
    socket.on("aura", (data) => {
        //console.log(data);
        let new_arr = data.map(i => i ? Math.round(i) : 0)
        if (!arraysEqual(cur.aura, new_arr)) {
            cur.aura = new_arr;
            fps_a.aura++;
        }

        //aurasync.forEach( led => led.setColor(`rgb(${cur[0]}, ${cur[1]}, ${cur[2]})`));
        //console.log(cur);
    });

    socket.on("logi", (data) => {
        //console.log(data);
        let new_arr = data.map(i => i ? Math.round(i) : 0)
        if (!arraysEqual(cur.logi, new_arr)) {
            cur.logi = new_arr;
            fps_a.logi++;
        }

        //aurasync.forEach( led => led.setColor(`rgb(${cur[0]}, ${cur[1]}, ${cur[2]})`));
        //console.log(cur);
        //fps_a.logi++;
    });
});

const led_t = 100; //poll frequency in ms
const skip_everysent = 20;
let skip_counter = 0;
let fps_a = {
    aura: 0,
    logi: 0
};
let cur = {
    aura: [0, 0, 0],
    logi: [0, 0, 0]
};

const readaudio = () => {
    //process.stdout.write(`fps_a=${Math.round(fps_a * 1000 / led_t)}, cur=${cur}          \r`);
    let str = Object.values(fps_a).reduce((a, c) => a + Math.round(c * 1000 / (led_t * Object.values(fps_a).length)));
    process.stdout.write(`${JSON.stringify({ str, fps_a, cur })}        \r`);
    fps_a = {
        aura: 0,
        logi: 0
    };

    if (skip_counter % skip_everysent) {
        if (cur.aura.reduce((c, a) => c + a)) {
            aura_sync.setColorNow(cur.aura[0], cur.aura[1], cur.aura[2]);
        }
        if (cur.logi.reduce((c, a) => c + a)) {
            p_logiled.setLighting(cur.logi[0], cur.logi[1], cur.logi[2]).catch(console.log);
        }
    }

    //cur = cur.map(i => i==128?255:128);
    skip_counter++;
    skip_counter %= skip_everysent;
};

const main = async () => {
    await aura_sync.init();
    await p_logiled.init();

    server.listen(port);
};

main().then(() => {
    setInterval(readaudio, led_t);
    console.log(io ? `WS Server is running on port ${port}` : `WS Server is not started`);
});
