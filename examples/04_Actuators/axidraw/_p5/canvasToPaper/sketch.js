let serial;
let portName = '/dev/tty.usbmodem14101'; // axidraw serial port name

let myPath = [];
let output = [];
let preMillis = 0;
let millisDiff = 0;
let newPath = true;
let factor = 5;

function setup() {
    serial = new p5.SerialPort(); // new instance of the serial port library
    serial.open(portName);

    canvas = createCanvas(600, 600);
    canvas.parent('canvascontainer');
    canvas.mouseReleased(endPath);
    let clearButton = select('#clearButton');
    clearButton.mousePressed(clearDrawing);
    background(0);
    fill(255);
    noStroke();
}

function mouseDragged() {
    let point = [mouseX, mouseY];
    myPath.push(point);

    // compute time elapsed since last call
    if (millis() !== preMillis) {
        millisDiff = Math.floor(millis() - preMillis);
        preMillis = millis();
    }

    let output = [];    // array for holding XY delta and timing value
    let x, y, ms, xOrY;
    if (newPath) {  // begining of a stroke
        if (myPath.length - 2 > -1) {   // current point that has a previous point
            // calculate step differences
            x = point[0] - myPath[myPath.length - 2][0];
            y = point[1] - myPath[myPath.length - 2][1];
        } else {
            x = point[0];
            y = point[1];
        }
        xOrY = Math.abs(x) > Math.abs(y) ? x : y;   // find the longer axis
        ms = Math.floor(((Math.abs(xOrY) / 1.31 - Math.abs(xOrY) / 25)) * 0.3);     // limit movement speed to 30% of the operating speed range
        ms *= factor;   //scaling
        newPath = false;
    } else {    // continous drawing
        x = point[0] - myPath[myPath.length - 2][0];
        y = point[1] - myPath[myPath.length - 2][1];
        ms = millisDiff;
    }
    x *= factor;    //scaling
    y *= factor;
    output = [ms, x, y];
    output.push(output);
    penDown();
    move(output[output.length-1][0],output[output.length-1][1], output[output.length-1][2]);
    ellipse(mouseX, mouseY, 10, 10);
}

function endPath() {
    newPath = true;
    penUp();
    console.log("end path");
}

function clearDrawing() {
    background(0);
    myPath = [];
}