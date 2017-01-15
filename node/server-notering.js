
var Phidget = require('phidgetapi');
var easymidi = require('easymidi');
var midi = require("midi");
var osc = require('node-osc');
var Performer = require('./Performer.js');
var NoteManager = require('./NoteManager.js');

var NUM_PERFORMERS = 8;
var notes = new NoteManager(NUM_PERFORMERS);
var midiOutput;
var midiInput;
var inputStatus = [0,0,0,0,0,0,0,0];
var performers =[];

function init(){
	console.log('Init called');
	
	createMidiOutput();
	createPerformers();
	createMidiInput();
	
}

var createMidiOutput = function(){

	var midiList = easymidi.getOutputs();
	var outputName = "";
	for (var p in midiList){
		if (midiList[p].indexOf("ToAbleton") != -1){
			outputName = midiList[p];
			console.log("using " + outputName + " for output");
		}
	}
	midiOutput = new easymidi.Output(outputName);
	midiOutput.send('noteon', {
		note : 64,
		velocity : 127,
		channel : 0
	});

};

var createMidiInput = function(){

	var midiList = easymidi.getInputs();
	var name = "";
	for (var p in midiList){
		if (midiList[p].indexOf("FromAbleton") != -1){
			name = midiList[p];
			
			break;
		}
	}
	console.log("using " + name + " for input");
	midiInput = new easymidi.Input(name);
	midiInput.on("noteon", function(msg){
		notes.newNote(msg.note);
	});
};

var createPerformers = function(){
	for (var i=0; i < NUM_PERFORMERS; i++){
		var p = new Performer();
		p.init(3333 + i, midiOutput, i, 1, i);
		performers.push(p);
	}
};

var IK=new Phidget.InterfaceKit();
IK.observeInputs(inputs);

function inputs(changes){
	for(var i in changes){
		var change=changes[i];
		if (change.type == "update"){
			for (var i=0; i < change.object.length; i++){

				if (inputStatus[i] != change.object[i]){
					if (change.object[i] == 1){
						performers[i].noteOn(notes.getNote());
					}
					inputStatus[i] = change.object[i];
				}

			}
			
		}
	}
}

IK.whenReady(init);

IK.connect();

process.stdin.resume();

