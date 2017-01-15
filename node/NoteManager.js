var NOTE_GROUP_TIMEOUT = 1000;

var NoteManager = function(numPerformers){
	
	this.numPerformers = numPerformers;

	this.notes = [64];
	this.noteIndex = 0;
	this.lastNoteInput = Date.now();
};

var p = NoteManager.prototype;

p.newNote = function(noteNumber){
	if (Date.now() - this.lastNoteInput > NOTE_GROUP_TIMEOUT){
		// new note group
		this.notes = [];
	}
	this.notes.push(noteNumber);
	this.lastNoteInput = Date.now();
	console.log("registered new note : " + noteNumber);
}


p.getNote = function(){
	var note = this.notes[this.noteIndex];
	this.noteIndex++;
	if (this.noteIndex >= this.notes.length) this.noteIndex = 0;
	return note;
};



module.exports = NoteManager;