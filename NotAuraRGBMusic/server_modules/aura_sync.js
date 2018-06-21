const { AuraSDK, Controller } = require('aura-sdk')

let aurasync = null;

const setColorNow = async (r, g, b) => {
    if (aurasync)
        aurasync.forEach(led => led.setColorNow(`rgb(${r}, ${g}, ${b})`));
    //aurasync.forEach(led => led.setColorNow(`rgb(32,32,32)`));
    //aurasync.forEach( led => led.updateColor() );
};

const init = async () => {
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
};

module.exports = {
    init,
    setColorNow
};