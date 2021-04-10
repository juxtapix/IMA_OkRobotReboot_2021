const SerialPort = require('serialport');

const portName = "/dev/tty.usbmodem14101"; // your path should vary, edit after you scanPort()
const portAxiDraw = new SerialPort(portName);

let myPath = [
    [2000, 0],
    [2000, 2000],
    [0, 2000],
    [0, 0]
];

function init() {
    // call scanPort to figure out path to AxiDraw serial port
    // scanPort();

    if (portAxiDraw.opening) {
        console.log(portAxiDraw.path + ' is open...');
        draw();
    }
}

function draw() {
    // meaneuvering AxiDraw with the below action sequence
    penUp();
    move(1000, 1000, 0);
    penDown();
    move(2000, 0, -1000);
    togglePen();
    sendCommand("XM,3000,-1000,1000");
    togglePen();

    // draw a path with XY coordinates
    penDown();
    moveAlong(myPath);
    penUp();
}

function scanPort() {
    SerialPort.list().then(function (ports) {
        // console.log(ports);
        ports.forEach(port => {
            if (port.path.includes("usb")) {
                console.log(port.path);
            }
        });
    }).catch(function (error) {
        console.log(error);
    });
}

// https://evil-mad.github.io/EggBot/ebb.html for complete command documentation

function penUp() {
    let cmd = "SP,0";
    sendCommand(cmd);
}

function penDown() {
    let cmd = "SP,1";
    sendCommand(cmd);
}

function togglePen() {
    let cmd = "TP\r";
    sendCommand(cmd);
}

function enableMotors() {
    let cmd = 'EM,1,1';
    sendCommand(cmd);
}

function disableMotors() {
    let cmd = 'EM,0,0';
    sendCommand(cmd);
}

function move(ms, x, y) {
    // in "ms" milliseconds, move x-axis by "x" steps, y-axis by "y" steps
    let cmd = `XM,${ms},${x},${y}`;
    sendCommand(cmd);
}

function moveAlong(p) {
    // compute XY delta values with given XY coordinates 
    let output = [];    // array for holding XY delta and timing value
    let x, y, ms, xOrY;
    for (i = 0; i < p.length; i++) {
        if (i - 1 >= 0) {   // current point that has a previous point
            // calculate step differences
            x = p[i][0] - p[i - 1][0];
            y = p[i][1] - p[i - 1][1];
        } else {
            x = p[i][0];
            y = p[i][1];
        }
        xOrY = Math.abs(x) > Math.abs(y) ? x : y;   // find the longer axis
        ms = Math.floor(((Math.abs(xOrY) / 1.31 - Math.abs(xOrY) / 25)) * 0.3);     // limit movement speed to 30% of the operating speed range
        output.push([ms, x, y]);
    }
    for (i = 0; i < output.length; i++) {
        let cmd = `XM,${output[i][0]},${output[i][1]},${output[i][2]}`;
        sendCommand(cmd);
    }
}

function sendCommand(c) {
    let cmd = c + '\r';
    portAxiDraw.write(cmd, function (err) {
        if (err) {
            return console.log('Error on write: ', err.message)
        }
        console.log('message written:', cmd);
    });
}

init();