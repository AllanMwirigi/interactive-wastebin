from gpiozero import DistanceSensor
from time import sleep

sensor = DistanceSensor(echo=18, trigger=17)
# TODO: should get an average of a number of measurements before sending, to account for the inconsistent values that come up occassionally

def computeHeight():
    # print('Starting ultrasonic')
    counter = 0
    measured = None
    while counter < 7:
        value = sensor.distance * 100
        print('Distance: ', value, 'cm')
        if value > 0 and value < 95: # weird values that come up sometimes
            measured = value
            counter += 1
        sleep(1)
    
    if measured is not None:
        print('Ultrasonic Height: ', measured, 'cm')
        # TODO: send to backend

# import RPi.GPIO as GPIO
# import time
 
# #GPIO Mode (BOARD / BCM)
# GPIO.setmode(GPIO.BCM)
 
# #set GPIO Pins
# GPIO_TRIGGER = 17
# GPIO_ECHO = 18
 
# #set GPIO direction (IN / OUT)
# GPIO.setup(GPIO_TRIGGER, GPIO.OUT)
# GPIO.setup(GPIO_ECHO, GPIO.IN)
 
# def distance():
#     # set Trigger to HIGH
#     GPIO.output(GPIO_TRIGGER, True)
#     # set Trigger after 0.01ms to LOW
#     time.sleep(0.00001)
#     GPIO.output(GPIO_TRIGGER, False)
 
#     StartTime = time.time()
#     StopTime = time.time()
 
#     # save StartTime
#     while GPIO.input(GPIO_ECHO) == 0:
#         StartTime = time.time()
 
#     # save time of arrival
#     while GPIO.input(GPIO_ECHO) == 1:
#         StopTime = time.time()
 
#     # time difference between start and arrival
#     TimeElapsed = StopTime - StartTime
#     # multiply with the sonic speed (34300 cm/s)
#     # and divide by 2, because there and back
#     distance = (TimeElapsed * 34300) / 2
 
#     return distance
 
# if __name__ == '__main__':
#     try:
#         while True:
#             dist = distance()
#             print ("Measured Distance = %.1f cm" % dist)
#             time.sleep(1)
 
#         # Reset by pressing CTRL + C
#     except KeyboardInterrupt:
#         print("Measurement stopped by User")
#         GPIO.cleanup()