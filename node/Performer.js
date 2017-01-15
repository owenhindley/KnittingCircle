var TouchOSCListener = require("./TouchOSCListener.js");
var EventEmitter = require("events").EventEmitter;


var Performer = function() {
	
};

var p = Performer.prototype = new EventEmitter();

p.init = function(oscPort, midiOutput, midiChannel, ccChannel, index){
	console.log("creating performer on osc port " + oscPort + ", midi port " + midiChannel);
	this.accel = new TouchOSCListener(oscPort, midiOutput, midiChannel, ccChannel);
	this.midiOutput = midiOutput;
	this.midiChannel = midiChannel;
	this.index = index;
};

p.noteOn = function(note){
	console.log("note " + note + " from " + this.index);
	this.midiOutput.send('noteon', {
		note : note,
		velocity : 127,
		channel : this.midiChannel
	});
};





module.exports = Performer;