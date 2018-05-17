// This is "processor.js" file, evaluated in AudioWorkletGlobalScope upon
// audioWorklet.addModule() call in the main global scope.
class MyWorkletProcessor extends AudioWorkletProcessor {
    constructor() {
        super();

        this.port.onmessage = (event) => {
            // Handling data from the node.
            console.log(event.data);
        };

        //this.port.postMessage('Hi!');
    }

    process(inputs, outputs, parameters) {
        // audio processing code here.
        //console.log({ inputs, outputs, parameters });
        let input = inputs[0];
        let output = outputs[0];
        for (let channel = 0; channel < output.length; ++channel) {
            output[channel].set(input[channel]);
        }

        this.port.postMessage(0);
        return true;
    }
}

registerProcessor('my-worklet-processor', MyWorkletProcessor);