# pip3 install pyserial
import serial
from serial.tools.list_ports import comports
import math

# your path should vary, edit after you scan_port()
port_name = '/dev/tty.usbmodem14101'
port_axidraw = serial.Serial(port_name)
my_path = [
    [2000, 0],
    [2000, 2000],
    [0, 2000],
    [0, 0]
]


def init():
    # call scanPort to figure out path to AxiDraw serial port
    # scan_port()

    if port_axidraw.isOpen():
        print(port_axidraw.name + ' is open...')
        draw()


def draw():
    # meaneuvering AxiDraw with the below action sequence
    pen_up()
    move(1000, 1000, 0)
    pen_down()
    move(2000, 0, -1000)
    toggle_pen()
    send_command('XM,3000,-1000,1000')
    toggle_pen()

    # draw a path with XY coordinates
    pen_down()
    move_along(my_path)
    pen_up()


def scan_port():
    for port in comports():
        # print(port)
        if 'usb' in port[0]:
            print(port[0])


# https://evil-mad.github.io/EggBot/ebb.html for complete command documentation

def pen_up():
    cmd = 'SP,0'
    send_command(cmd)


def pen_down():
    cmd = 'SP,1'
    send_command(cmd)


def toggle_pen():
    cmd = 'TP'
    send_command(cmd)


def move(ms, x, y):
    # in "ms" milliseconds, move x-axis by "x" steps, y-axis by "y" steps
    cmd = 'XM,{0},{1},{2}'.format(ms, x, y)
    send_command(cmd)


def send_command(c):
    cmd = c + '\r'
    port_axidraw.write((cmd).encode('utf-8'))     # write a string
    print('message written:', cmd)
    res = port_axidraw.readline().decode('utf-8').strip()
    # print(res.lower())
    while res.lower() != 'ok':
        pass


def move_along(p):
    output = []
    print(len(p))
    for i in range(len(p)):
        # for i in ps:
        if (i - 1 >= 0):    # current point that has a previous point
            # calculate step differences
            x = p[i][0] - p[i - 1][0]
            y = p[i][1] - p[i - 1][1]
        else:
            x = p[i][0]
            y = p[i][1]
        xOrY = x if (abs(x) > abs(y)) else y   # find the longer axis
        # limit movement speed to 30% of the operating speed range
        ms = math.floor(((abs(xOrY) / 1.31 - abs(xOrY) / 25)) * 0.3)
        output.append([ms, x, y])
    for j in range(len(output)):
        cmd = 'XM,{ms},{x},{y}'.format(
            ms=output[j][0], x=output[j][1], y=output[j][2])
        send_command(cmd)


init()
