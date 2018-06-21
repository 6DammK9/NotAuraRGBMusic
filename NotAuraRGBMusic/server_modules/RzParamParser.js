'use strict';

const fnc_parse = {
    effects: {
        regular: (effect, data) => {
            let jsonObj;
            switch (effect) {
                case "CHROMA_NONE": jsonObj = { "effect": effect }; break;
                case "CHROMA_CUSTOM": jsonObj = { "effect": effect, "param": data }; break;
                case "CHROMA_STATIC": jsonObj = { "effect": effect, "param": { "color": data } }; break;
                default: console.log(`Uncaught effect: ${effect}`);
            }
            return jsonObj;
        }
    }
}

module.exports = {
    effects: {
        keyboard: (effect, data) => {
            let jsonObj;
            switch (effect) {
                case "CHROMA_NONE": jsonObj = { "effect": effect }; break;
                case "CHROMA_CUSTOM": jsonObj = { "effect": effect, "param": data }; break;
                case "CHROMA_STATIC": jsonObj = { "effect": effect, "param": { "color": data } }; break;
                case "CHROMA_CUSTOM_KEY": jsonObj = { "effect": effect, "param": { "color": data, "key": data } }; break;
                default: console.log(`Uncaught effect: ${effect}`);
            }
            return jsonObj;
        },
        mousepad: fnc_parse.effects.regular,
        mouse: (effect, data) => {
            let jsonObj;
            switch (effect) {
                case "CHROMA_NONE": jsonObj = { "effect": effect }; break;
                case "CHROMA_CUSTOM2": jsonObj = { "effect": effect, "param": data }; break;
                case "CHROMA_STATIC": jsonObj = { "effect": effect, "param": { "color": data } }; break;
                default: console.log(`Uncaught effect: ${effect}`);
            }
            return jsonObj;
        },
        headset: fnc_parse.effects.regular,
        keypad: fnc_parse.effects.regular,
        chromalink: fnc_parse.effects.regular,
    },

};