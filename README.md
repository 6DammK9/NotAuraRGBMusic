
# NotAuraRGBMusic
## Definitely not Aura RGB Music mode.
- Flash lights according scientific calculation. 
- It blasts with funky music and stay calm in monotone.
- Instead of programming from bottom, it is scripted from top. Yes, it's a web application.
### System requirement
- NodeJS 32-bit ( from [aura-sdk](https://www.npmjs.com/package/aura-sdk) a.k.a [this thread](https://rog.asus.com/forum/showthread.php?101776-Aura-SDK-in-Javascript!) ), v8 or higher (written in ES2016+)
- A Web Browser Supporting [ WebAudio](https://caniuse.com/#feat=audio-api) ( It's in [HTML5 spec](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) ) and [ES2016+](https://kangax.github.io/compat-table/es2016plus/)
- Internet Connection ( Installation + Fetching scripts on run )
- An avaliable internet port ( default [http://localhost:9997/](http://localhost:9997/) )
- A PC running Aura RGB ( Currently works in graphic card only )
- Chrome 66+ for enabling [AudioWorklet](https://developer.mozilla.org/en-US/docs/Web/API/Worklet/addModule), a new sound processing routine. 
-- ( Currently having **360+ FPS** on sound processing instead of V-synced with canvas ) 
### Installation
- Clone or Download this repository
- Locate the folder `./NotAuraRGBMusic` via CLI 
-- For Windows, go to that folder, `Shift+Enter` and "open console in folder".
- `npm install`
- `npm start` or `node AURA_WS.js`
- Double check your default System Sound Input and Output ( Webpage use default options only )
- Open [http://localhost:9997/](http://localhost:9997/) in browser 
- Make sure you open it in a separate Window ( It halts when switched tab or minimized - To be investigated. )
- Click ( required by recent Chrome ) and enjoy the blast!
### General workflow
- Fetch, tune (if you want), and analyse Audio, then obtatin sound volume ( by rms ) and base frequency ( detault autocorrelation, with  FFT peak as fallback )
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
- Draw the spectrum, and send the RGB value to server via WebSocket
- When server received RGB value, buffer it and poll to Aura RGB devices by interval
### Options
- Coming soon ( just modify scripts and try )
### TODOs
- Find hardware to test `aura-sdk` ( I have RGB GPU only )
- Configuration file for server + Configuration in entry point ( webpage )
- Standalone webpage without internet connection ( currently using CDN )
- Code review ( currently it's totally in mess )
### Changelog

|Version|Description|
|---|---|
|0.0.1|Initial (and still in progress) commit|

### Contact
- Email 6DammK9@gmail.com or create Issue / PR
