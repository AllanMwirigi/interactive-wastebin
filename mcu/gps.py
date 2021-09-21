import serial
import time
import string 
import pynmea2
import io


# NOTE: need to go be outside for the sensor to connect to satellites
while True: 
    port="/dev/ttyAMA0"
    ser=serial.Serial(port,baudrate=9600,timeout=0.5)
    dataout =pynmea2.NMEAStreamReader()
    newdata=ser.readline().decode('utf-8', 'ignore')
    # print("newdata", newdata)
    if newdata[0:6] == "$GPRMC":
    # if b"$GPRMC" in newdata:
        newmsg=pynmea2.parse(newdata)
        lat=newmsg.latitude
        lng=newmsg.longitude
        gps="Latitude:" +str(lat) + " | Longitude:" +str(lng)
        print(gps)

# ser = serial.Serial('/dev/ttyAMA0', baudrate=9600, timeout=5.0)
# sio = io.TextIOWrapper(io.BufferedRWPair(ser, ser))

# while True:
#     try:
#         line = sio.readline()#.decode('utf-8', 'ignore')
#         msg = pynmea2.parse(line)
#         # print(repr(msg))
#         lat=msg.latitude
#         lng=msg.longitude
#         gps="Latitude:" +str(lat) + " | Longitude:" +str(lng)
#         print(gps)
#     except serial.SerialException as e:
#         print('Device error: {}'.format(e))
#         break
#     except pynmea2.ParseError as e:
#         print('Parse error: {}'.format(e))
#         continue
