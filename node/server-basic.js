
var Phidget = require('phidgetapi');
var easymidi = require('easymidi');
var osc = require('node-osc');

var MAX_PB = 16384;
var lastValue = 0.0;

var oscServer = new osc.Server(3333, '0.0.0.0');
oscServer.on("message", function(msg, rinfo){
	// console.log(msg);
	// CC change
	// var val = 64 + (msg[2] * 64);
	// if (midiOutput){
	// 	midiOutput.send("cc", {
	// 		controller : 1,
	// 		value : val,
	// 		channel : 1
	// 	});
	// 	console.log("cc 1 : " + val);
	// }
	// pitch change
	var val = MAX_PB/2.0 + (msg[2] * 0.5 * MAX_PB/2.0);
	if (midiOutput){
		midiOutput.send("pitch", {
			value : val,
			channel : 1
		});
		// console.log("pitchbend : " + val);
		// console.log(msg[2]);

		// var diff = Math.abs(msg[2] - lastValue);
		// console.log(diff);
		// if (diff > 1.1){

		// 	midiOutput.send('noteon', {
		// 		note : noteCounts[0],
		// 		velocity : 127,
		// 		channel : 0
		// 	});
		// }
		// lastValue = Math.abs(msg[2]);
	}
	

});

var midiOutput;
var noteBase = 64;
var noteLimit = 76;

var noteCounts = [noteBase,noteBase,noteBase,noteBase,noteBase,noteBase,noteBase,noteBase];
var inputStatus = [0,0,0,0,0,0,0,0];

var IK=new Phidget.InterfaceKit();

IK.observeInputs(inputs);

function inputs(changes){
	for(var i in changes){
		var change=changes[i];
		//see specific info about each change
		console.log(change);
		if (change.type == "update"){
			for (var i=0; i < change.object.length; i++){
				if (inputStatus[i] != change.object[i]){
					noteCounts[i]++;
					if (noteCounts[i] > noteLimit) noteCounts[i] = noteBase;
					if (change.object[i] == 1){
						midiOutput.send('noteon', {
							note : noteCounts[i],
							velocity : 127,
							channel : i
						});
					}
					inputStatus[i] = change.object[i];
				}
			}
			// if (change.object[0] == 1){
			// 	noteCounts[++;
			// 	if (noteBase > noteLimit) noteBase = 64;

			// 	midiOutput.send('noteon', {
			// 		note : noteBase,
			// 		velocity : 127,
			// 		channel : 0
			// 	});
			// 	console.log("sending midi note ON " + noteBase);
			// }
			// if (change.object[0] == 0){
				
			// 	// midiOutput.send('noteoff', {
			// 	// 	note : noteBase,
			// 	// 	velocity : 127,
			// 	// 	channel : 0
			// 	// });
			// 	// console.log("sending midi note OFF " + noteBase);
			// }
		}
	}

	//see updated IK data after all changes
	// console.log('Inputs',IK.inputs);
}

IK.whenReady(init);

IK.connect();

function init(){
	console.log('init');
	var midiList = easymidi.getOutputs();
	var outputName = "";
	for (var p in midiList){
		if (midiList[p].indexOf("Ableton") != -1){
			outputName = midiList[p];
			console.log("using " + outputName);
		}
	}
	midiOutput = new easymidi.Output(outputName);
	midiOutput.send('noteon', {
		note : 64,
		velocity : 127,
		channel : 0
	});
}