/**
 * This will wrap all the functions into promise.
**/

var logiled = require('logiled');

let sleep = ms => new Promise(r => setTimeout(r, ms))

const p_logiled = {
    init: () => { return new Promise((t, f) => { if (logiled.init()) { t(); } else { f(); } }); },

    //assert.equal(typeof version.majorNum, 'number');
    //assert.equal(typeof version.minorNum, 'number');
    //assert.equal(typeof version.buildNum, 'number');
    getSdkVersion: () => {
        return new Promise((t, f) => {
            let version = {};
            if (logiled.getSdkVersion(version)) { t(version); } else { f(); }
        });
    },

    //assert.equal(typeof configOption.value, 'number');
    getConfigOptionNumber: (configPath) => {
        return new Promise((t, f) => {
            let configOption = {
                configPath: configPath,
                defaultValue: 0
            };
            if (logiled.getConfigOptionNumber(configOption)) { t(configOption); } else { f(); }
        });
    },

    //assert.equal(typeof configOption.value, 'boolean');
    getConfigOptionBool: (configPath) => {
        return new Promise((t, f) => {
            let configOption = {
                configPath: configPath,
                defaultValue: 0
            };
            if (logiled.getConfigOptionBool(configOption)) { t(configOption); } else { f(); }
        });
    },

    //assert.equal(typeof configOption.red, 'number');
    //assert.equal(typeof configOption.green, 'number');
    //assert.equal(typeof configOption.blue,  'number');
    getConfigOptionColor: (configPath) => {
        return new Promise((t, f) => {
            let configOption = {
                configPath: configPath,
                defaultRed: 0,
                defaultGreen: 0,
                defaultBlue: 0,
            };
            if (logiled.getConfigOptionColor(configOption)) { t(configOption); } else { f(); }
        });
    },

    //[{ configPath: 'player', label: 'Player' }]
    setConfigOptionLabel: (configOptions) => {
        //Note: Running in Parallel.
        let p_array = [];
        configOptions.forEach((configOption) => {
            p_array.push(new Promise((t, f) => {
                if (logiled.setConfigOptionLabel(configOption)) { t(); } else { f(); }
            }));
        });
        return new Promise.all(p_array);
    },

    //DEVICETYPE_MONOCHROME: 1,
    //DEVICETYPE_RGB: 2,
    //DEVICETYPE_PERKEY_RGB: 4,
    //DEVICETYPE_ALL: 7
    setTargetDevice: (targetDevice) => {
        return new Promise((t, f) => {
            if (logiled.setTargetDevice({
                targetDevice: targetDevice ? targetDevice : logitech.DEVICETYPE_ALL
            })) { t(); } else { f(); }
        });
    },

    saveCurrentLighting: () => { return new Promise((t, f) => { if (logiled.saveCurrentLighting()) { t(); } else { f(); } }); },

    //0 to 100
    setLighting: (redPercentage, greenPercentage, bluePercentage) => {
        let obj = { redPercentage, greenPercentage, bluePercentage };
        return new Promise((t, f) => {
            if (logiled.setLighting(obj)) { t(); } else { f(); }
        });
    },

    restoreLighting: () => { return new Promise((t, f) => { if (logiled.restoreLighting()) { t(); } else { f(); } }); },

    flashLighting: (redPercentage, greenPercentage, bluePercentage, milliSecondsDuration, milliSecondsInterval) => {
        return new Promise((t, f) => {
            if (logiled.flashLighting({
                redPercentage, greenPercentage, bluePercentage, milliSecondsDuration, milliSecondsInterval
            })) { t(); } else { f(); }
        });
    },

    pulseLighting: (redPercentage, greenPercentage, bluePercentage, milliSecondsDuration, milliSecondsInterval) => {
        return new Promise((t, f) => {
            if (logiled.pulseLighting({
                redPercentage, greenPercentage, bluePercentage, milliSecondsDuration, milliSecondsInterval
            })) { t(); } else { f(); }
        });
    },

    stopEffects: () => { return new Promise((t, f) => { if (logiled.stopEffects()) { t(); } else { f(); } }); },

    //logiled.LED_BITMAP_HEIGHT = 6
    //logiled.LED_BITMAP_WIDTH = 21
    //bitmap: [0-256], for (LED_BITMAP_HEIGHT) for (LED_BITMAP_WIDTH)
    //LED_BITMAP_BYTES_PER_KEY = 4
    //LED_BITMAP_SIZE = 504
    setLightingFromBitmap: (bitmap) => {
        return new Promise((t, f) => {
            if (logiled.setLightingFromBitmap({ bitmap })) { t(); } else { f(); }
        });
    },

    setLightingForKeyWithScanCode: (keyCode, redPercentage, greenPercentage, bluePercentage) => {
        return new Promise((t, f) => {
            if (logiled.setLightingForKeyWithScanCode({
                keyCode, redPercentage, greenPercentage, bluePercentage
            })) { t(); } else { f(); }
        });
    },

    //const LOGI_KEY_NUMLOCK_SCANCODE    = 0x45;
    setLightingForKeyWithHidCode: (keyCode, redPercentage, greenPercentage, bluePercentage) => {
        return new Promise((t, f) => {
            if (logiled.setLightingForKeyWithHidCode({
                keyCode, redPercentage, greenPercentage, bluePercentage
            })) { t(); } else { f(); }
        });
    },

    //const LOGI_KEY_NUMLOCK_HIDCODE     = 0x45;
    setLightingForKeyWithHidCode: (keyCode, redPercentage, greenPercentage, bluePercentage) => {
        return new Promise((t, f) => {
            if (logiled.setLightingForKeyWithHidCode({
                keyCode, redPercentage, greenPercentage, bluePercentage
            })) { t(); } else { f(); }
        });
    },

    //const LOGI_KEY_NUMLOCK_QUARTZCODE  = 0x47;
    setLightingForKeyWithQuartzCode: (keyCode, redPercentage, greenPercentage, bluePercentage) => {
        return new Promise((t, f) => {
            if (logiled.setLightingForKeyWithQuartzCode({
                keyCode, redPercentage, greenPercentage, bluePercentage
            })) { t(); } else { f(); }
        });
    },

    //logiled.KeyName
    setLightingForKeyWithKeyName: (keyName, redPercentage, greenPercentage, bluePercentage) => {
        return new Promise((t, f) => {
            if (logiled.setLightingForKeyWithQuartzCode({
                keyName, redPercentage, greenPercentage, bluePercentage
            })) { t(); } else { f(); }
        });
    },

    //logiled.KeyName
    saveLightingForKey: (keyName) => {
        return new Promise((t, f) => {
            if (logiled.saveLightingForKey({ keyName })) { t(); } else { f(); }
        });
    },

    //logiled.KeyName
    restoreLightingForKey: (keyName) => {
        return new Promise((t, f) => {
            if (logiled.restoreLightingForKey({ keyName })) { t(); } else { f(); }
        });
    },

    //[logiled.KeyName]
    excludeKeysFromBitmap: (keyList) => {
        return new Promise((t, f) => {
            if (logiled.restoreLightingForKey({ keyList })) { t(); } else { f(); }
        });
    },

    flashSingleKey: (keyName, redPercentage, greenPercentage, bluePercentage, milliSecondsDuration, milliSecondsInterval) => {
        return new Promise((t, f) => {
            if (logiled.flashSingleKey({
                keyName, redPercentage, greenPercentage, bluePercentage, milliSecondsDuration, milliSecondsInterval
            })) { t(); } else { f(); }
        });
    },

    pulseSingleKey: (keyName, redPercentage, greenPercentage, bluePercentage, finishRedPercentage, finishGreenPercentage, finishBluePercentage, milliSecondsDuration, milliSecondsInterval) => {
        return new Promise((t, f) => {
            if (logiled.flashSingleKey({
                keyName, redPercentage, greenPercentage, bluePercentage, finishRedPercentage, finishGreenPercentage, finishBluePercentage, milliSecondsDuration, milliSecondsInterval
            })) { t(); } else { f(); }
        });
    },

    stopEffectsOnKey: (keyName) => {
        return new Promise((t, f) => {
            if (logiled.stopEffectsOnKey({ keyName })) { t(); } else { f(); }
        });
    },

    shutdown: () => { return new Promise((t, f) => { if (logiled.shutdown()) { t(); } else { f(); } }); },

    logiled: logiled
};

const main = async () => {
    // always initialize the library first...
    await p_logiled.init();

    await sleep(1000);

    let version = await p_logiled.getSdkVersion();

    console.log(version);
    //console.log(logiled);

    await sleep(1000);

    await p_logiled.setTargetDevice(7);

    await sleep(1000);

    let delay = 90;

    for (let i = 0; i < (10 * 1000 / delay); i++) {
        let b = [0, 50, 100][i % 3]; //Math.round(Math.random() * 100)
        await p_logiled.setLighting(b, b, b);
        //console.log([b,b,b]);
        await sleep(delay);
    }

    await logiled.stopEffects();

    await sleep(1000);

    await p_logiled.shutdown();

    await sleep(1000);
};

if (process.argv[2] && process.argv[2].includes("g213")) {
    main().then(console.log).catch(console.log);
}

module.exports = p_logiled;