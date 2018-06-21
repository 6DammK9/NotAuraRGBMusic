'use strict';
//Note: REST API will be used.
const request = require("request");
const RzErrors = require("./RzErrors");
const RzParamParser = require("./RzParamParser");

//Keywords as url routes. Should follow these keywords.
const device_supported = {
    "keyboard": "keyboard",
    "mouse": "mouse",
    "headset": "headset",
    "mousepad": "mousepad",
    "keypad": "keypad",
    "chromalink": "chromalink"
};
const init_body = {
    "title": "HTML5ChromaSDK",
    "description": "JS Library for playing Chroma animations",
    "author": {
        "name": "Razer, Inc.",
        "contact": "https://github.com/RazerOfficial/HTML5ChromaSDK"
    },
    "device_supported": Object.values(device_supported),
    "category": "application"
};

const handle_er = (e, r) => {
    if (e) { console.log(e); }
    if (r && r.statusCode && r.statusCode !== 200) { console.log(r); }
};

const handle_b = {
    "effect": (b) => {
        //console.log(JSON.stringify(b));
        if (b && b.result) { console.log(RzErrors.parseErr(b.result)); }
        if (b && b.id) { console.log(b.id); }
    }
};

const handle_erb = {
    "effect": (e, r, b, t, f) => {
        //e,r,b = request
        //t,f = promise
        handle_er(e, r);
        handle_b["effect"](b);
        if (b && b.id) { t(b.id); }
        else { t(); }
    }
}

//Probably the function I want.
//p_create_effect(request.put, "keyboard", effect, data);
const p_create_effect = (r_fnc, device, effect, data) => {
    return new Promise((t, f) => {
        if (!CHROMA_SESSION) { t(); }
        request[r_fnc]({ url: `${CHROMA_SESSION}/${device}`, json: true, body: RzParamParser.effects[device](effect, data) }, (e, r, b) => { handle_erb.effect(e, r, b, t, f); });
    });
};

let CHROMA_SDK_URL = "http://localhost:54235/razer/chromasdk";
let CHROMA_SESSION = null;
let heartbeat_interval = null;

let init_sdk = async function (url) {
    return new Promise((t, f) => {
        if (url) { CHROMA_SDK_URL = url; }
        request.get(CHROMA_SDK_URL, (e, r, b) => {
            if (e) { console.log(e); }
            if (r && r.statusCode && r.statusCode !== 200) { console.log(r); }
            console.log(JSON.stringify(b));
            t();
        });
    });
};

let onTimer = async function () {
    return new Promise((t, f) => {
        if (!CHROMA_SESSION) { t(); }
        else {
            request.put(`${CHROMA_SESSION}/heartbeat`, (e, r, b) => {
                handle_er(e, r);
                //console.log(b);
                t();
            });
        }
    });
};

let init_session = async function () {
    return new Promise((t, f) => {
        request.post({ url: CHROMA_SDK_URL, json: true, body: init_body }, (e, r, b) => {
            handle_er(e, r);
            console.log(JSON.stringify(b));
            if (b && b.uri) { CHROMA_SESSION = b.uri; }
            heartbeat_interval = setInterval(onTimer, 1000);
            t();
        });
    });
};

let uninit_session = async function () {
    return new Promise((t, f) => {
        if (!CHROMA_SESSION) { t(); }
        else {
            request.delete({ url: CHROMA_SESSION, json: true, body: {} }, (e, r, b) => {
                handle_er(e, r);
                console.log(JSON.stringify(b));
                t();
            });

            clearInterval(heartbeat_interval);
            this.CHROMA_SESSION = undefined;
        }
    });
};

let setEffect = async function (id) {
    return new Promise((t, f) => {
        if (!CHROMA_SESSION) { t(); }
        else { request.put({ url: `${CHROMA_SESSION}/effect`, json: true, body: { id } }, (e, r, b) => { handle_erb.effect(e, r, b, t, f); }); }
    });
};

let deleteEffect = async function (id) {
    return new Promise((t, f) => {
        if (!CHROMA_SESSION) { t(); }
        else { request.delete({ url: `${CHROMA_SESSION}/effect`, json: true, body: { id } }, (e, r, b) => { handle_erb.effect(e, r, b, t, f); }); }
    });
}

let deleteEffectGroup = async function (ids) {
    return new Promise((t, f) => {
        if (!CHROMA_SESSION) { t(); }
        else { request.delete({ url: `${CHROMA_SESSION}/effect`, json: true, body: ids }, (e, r, b) => { handle_erb.effect(e, r, b, t, f); }); }
    });
}

let staticColorAll = async function (color) {
    Object.values(device_supported).forEach((device) => {
        p_create_effect("put", device, "CHROMA_STATIC", color).catch(console.log);
    });
};

module.exports = {
    init_sdk,
    init_session,
    uninit_session,
    p_create_effect,
    setEffect,
    deleteEffect,
    deleteEffectGroup,
    staticColorAll
};