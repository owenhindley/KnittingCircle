var osc = require('node-osc');

var MAX_PB = 16384;

var TouchOSCListener = function(oscPort, midiOutput, midiChannel, ccChannel){
	
	this.server = new osc.Server(oscPort, "0.0.0.0");
	this.midiOutput = midiOutput;
	this.oscPort = oscPort;
	this.sendPitchBend = true;
	this.sendCC = false;
	this.ccChannel = ccChannel;
	this.midiChannel = midiChannel;

	this.server.on("message", this.onMessage.bind(this));

};

var p = TouchOSCListener.prototype;


p.onMessage = function(msg, rinfo){
	if (this.midiOutput){
		if (this.sendPitchBend){
			var val = MAX_PB/2.0 + (msg[2] * 0.5 * MAX_PB/2.0);
			this.midiOutput.send("pitch", {
				value : val,
				channel : this.midiChannel
			});
			// console.log("port " + this.oscPort + " sending bend " + val);
		}
		if (this.sendCC){
			this.midiOutput.send("cc", {
				controller : 1,
				value : 64 + (msg[2] * 64),
				channel : this.midiChannel
			});
		}
	}
};




module.exports = TouchOSCListener;