**Dead repo. Dependabot is so annoying, but I don't want to make this private. Therefore I rebuild the package.json**

# NotAuraRGBMusic
> Definitely not Aura RGB Music mode. It is a music visualizer with RGB device integration.
## Features
- Flash lights according scientific calculation. 
- It blasts with funky music and stay calm in monotone.
- Instead of programming from bottom, it is scripted from top. Yes, it's a web application.
## System requirement
### Audio Visualizer
- A Web Browser Supporting [ WebAudio](https://caniuse.com/#feat=audio-api) ( It's in [HTML5 spec](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) ) and [ES2016+](https://kangax.github.io/compat-table/es2016plus/)
### Backend RGB device control
- NodeJS 32-bit ( from [aura-sdk](https://www.npmjs.com/package/aura-sdk) a.k.a [this thread](https://rog.asus.com/forum/showthread.php?101776-Aura-SDK-in-Javascript!) ), v8 or higher (written in ES2016+)
- Internet Connection ( Installation + Fetching scripts on run )
- An avaliable internet port ( default [http://localhost:9997/](http://localhost:9997/) )
- A PC running Aura RGB ( Currently works in graphic card only )
- [Asus Aura Sync](https://www.asus.com/campaign/aura/tw/download.html)
- [Logitech Gaming Software](http://support.logitech.com/en_us/software/lgs)
- [Razer Synapse](https://www.razer.com/synapse)
### (In progress) Performance Boost
- Chrome 66+ for enabling [AudioWorklet](https://developer.mozilla.org/en-US/docs/Web/API/Worklet/addModule), a new sound processing routine. 
-- ( Currently having **360+ FPS** on sound processing instead of V-synced with canvas) 
### Installation
- Install all required software
- Clone or Download this repository
- Locate the folder `./NotAuraRGBMusic` via CLI 
-- For Windows, go to that folder, `Shift+Enter` and "open console in folder".
- `npm install`
- If you received problems about `logiled`, Goto `node_modules/logiled` and then `npm install` again.
- `npm start` or `node AURA_WS.js`
- Double check your default System Sound Input and Output ( Webpage use default options only )
- Open [http://localhost:9997/](http://localhost:9997/) in browser 
- Make sure you open it in a separate Window ( It halts when switched tab or minimized - To be investigated. )
- Click ( required by recent Chrome ) and enjoy the blast!
### Run in standalone webpage (as audio visualiser only)
- You can directly open `./public/analyser.html` as standalone webpage. 
- It still capture audio and perform analysis, but there will be no device control, or the [AudioWorklet](https://developer.mozilla.org/en-US/docs/Web/API/Worklet/addModule) feature.
### General workflow
- Detect and Fetch Audio source (with settings, e.g. sample rate, channels)
- Tune (if you want, currently attached with an empty `biquadFilter`)
- Analyse Audio, then obtatin sound volume ( by rms ) and base frequency ( detault autocorrelation, with  FFT peak as fallback )
- Calculate the relative power level from sound volume ( ranged from [0,1], based from the lowest sound volume in FFT spectrum )
- Draw the spectrum via canvas:

|x-axis|y-axis|color|
|---|---|---|
|octave|decibel|frequency of light spectrum| 

- Mark Base Frequency in spectrum:

|autocorrelation|FFT peak|
|---|---|
|White|Black|

- Merge the base frequency ( as the color of the mark )  and relative sound volume ( as a number from 0 to 1 ) into the final color as RGB value
- Draw the spectrum, and send the RGB value (scaled to device's parameter) to server via WebSocket
- When server received RGB value, buffer it and poll to Aura RGB devices by interval
### Options
- The cover page should contains all the general options.
- Coming soon ( just modify scripts and try )
### TODOs
- Find hardware to test `aura-sdk` ( I still don't have Asus MB )
- Need Keyboards supporting per key adjustment ( One per brand! )
- Configuration file for server (seperate class)
- Code review ( currently it's totally in mess )
- Using solely on AudioWorklet (Very useful when in extreme condition. < 30FPS in highest setting in animation, audio and web transfer) instead of AnalyserNode in main process
- [WebAssembly](https://developer.mozilla.org/en-US/docs/WebAssembly)
- Even more standalone solution - Pack everything in Electron, using IPC to communicate
- C# backend?
- Build script specially for `logiled`
- Native Razor device control ( Currently done in HTTP CRUD control )
### (Probably) rejected features 
- Cosair Devices (or any stuff needs hardware (e.g. Arduino) to control)
- Docker (Or any kinds of auto implementation)
- Any OS other than Windows (Actually it is not supported from upstream)
### Changelog
- 0.2.0
-- Razor Device supported.

- 0.1.0
-- Logitech Device supported.
-- Used `Promise` / `async function` to wrap the device-related functions.
-- Partially fixed Screen Scale problem on high Sample rate + FFT size.
-- Lowered the effect on sub-pixel rendering.
-- Supressed polling frequency to server (by random. Should be by delta.)
-- Offset tunning of color spectrum (To make the result more "colorful")
-- Added an option to draw nothing but keep sending data to server.

- 0.0.1
-- Initial (and still in progress) commit

### Contact
- Email 6DammK9@gmail.com or create Issue / PR
