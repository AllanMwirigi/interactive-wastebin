from gpiozero import MotionSensor, LED
#from time import sleep, time
from signal import pause

# gpiozero always uses BCM

pir = MotionSensor(4)
red = LED(19)

# A function to detect motion
def on_motion():
        print('Motion detected!')
        # red.off()

# A function when no motion is detected
def no_motion():
        print('No motion detected')
        # red.on()

pir.when_motion = on_motion
# pir.when_no_motion = no_motion

pause() # The process sleeps until a signal is received. And then the signal handler is called.
# investigate whether app terminates once first signal is received i.e. motion detected