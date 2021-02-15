// p5.speech - Basic
var robot = new p5.Speech(); // speech synthesis object
robot.listVoices();

function setup() {

}

function draw() {

}

function say(something) {
	robot.setVoice(Math.floor(random(robot.voices.length)));  // Randomize the available voices
	robot.speak(something); // say something
}

function mousePressed(){
	say('Hello Human'); // Say something when mousePressed
}
