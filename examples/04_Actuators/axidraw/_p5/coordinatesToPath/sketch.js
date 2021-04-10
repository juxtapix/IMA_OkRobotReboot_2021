let serial;
let portName = '/dev/tty.usbmodem14101'; // axidraw serial port name

let myPath = [
    [2000, 0],
    [2000, 2000],
    [0, 2000],
    [0, 0]
];

function setup() {
    serial = new p5.SerialPort(); // new instance of the serial port library
    serial.open(portName);
    penDown();
    moveAlong(myPath);
    penUp();
}

