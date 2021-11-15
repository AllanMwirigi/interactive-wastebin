import serial
import time
import string 
import pynmea2
import io
import os
import requests
from dotenv import load_dotenv
load_dotenv()

BACKEND_API_URL = os.getenv("BACKEND_API_URL")

def getLocation():

    # NOTE: need to be outside for the sensor to connect to satellites
    # The TX pin of the module is connected to the GPIO15 (RX) pin. 
    while True: 
        port="/dev/ttyAMA0"
        ser=serial.Serial(port,baudrate=9600,timeout=0.5)
        dataout =pynmea2.NMEAStreamReader()
        newdata=ser.readline().decode('utf-8', 'ignore')
        counter = 0
        # print("newdata", newdata)
        if newdata[0:6] == "$GPRMC":
        # if b"$GPRMC" in newdata:
            newmsg=pynmea2.parse(newdata)
            lat=newmsg.latitude
            lng=newmsg.longitude
            gps="Latitude:" +str(lat) + " | Longitude:" +str(lng)
            print(gps)
            if lat > 0 and lng > 0:
                counter += 1
            if counter == 5:
                payload = { 'lat': lat, 'lng': lng }
                response = requests.patch(BACKEND_API_URL+'/bins/618292d613753dcf121a496c', data=payload)
                print(f'response {response.status_code}')
                break

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
