let serial;
let portName = '/dev/tty.usbmodem14101'; // axidraw serial port name

let speed = 5;

function setup() {
    serial = new p5.SerialPort(); // new instance of the serial port library
    serial.open(portName);
}

function draw() {
    keyboardMove(speed);
}

