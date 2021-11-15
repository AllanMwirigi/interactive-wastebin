from gpiozero import MotionSensor, LED
#from time import sleep, time
import signal
import threading
from timeloop import Timeloop
from datetime import timedelta
import ultrasonic
import audio
import gps

# gpiozero always uses BCM
# NOTE: PIR sensor has 1min initialization period on startup
pir = MotionSensor(4)
# red = LED(19)

motion_detected = False
audioThread = threading.Thread(target=audio.play, daemon=True)

# A function to detect motion
def on_motion():
    global audioThread
    motion_detected = True
    print('Motion detected!')
    # red.off()
    if not audioThread.is_alive():
        audioThread = threading.Thread(target=audio.play, daemon=True)
        audioThread.start()

# A function when no motion is detected
def no_motion():
    motion_detected = False
    # print('No motion detected')
    # red.on()

pir.when_motion = on_motion
# pir.when_no_motion = no_motion

# compute volume from ultrasonic sensor on separate thread

tl = Timeloop()

@tl.job(interval=timedelta(minutes=0.1))
def compute_height_every_2min():
    ultrasonic.computeHeight()

@tl.job(interval=timedelta(minutes=10))
def get_location_every_10min():
    gps.getLocation()

# tl.start() # starts timeloop on separate thread
# tl.start(block=True) # starts timeloop on main thread

def signal_handler(signum, frame):
    # need to terminate timeloop gracefully as it is running on separate thread
    print('Terminating timeloop')
    tl.stop()

signal.signal(signal.SIGTERM, signal_handler)
signal.signal(signal.SIGINT, signal_handler)

# ultrasonic sensor will operate on a separate thread
# x = threading.Thread(target=thread_function, args=(1,)) # When you create a Thread, you pass it a function and a list containing the arguments to that function. In this case, you’re telling the Thread to run thread_function() and to pass it 1 as an argument.
# ultrasonicThread = threading.Thread(target=ultrasonic.computeVolume, daemon=True) # daemon indicates that the thread will be killed when main terminates
# ultrasonicThread.start()

# NOTE: ultrasonic sensor is affected by long running loops in other threads, since all threads ideally share the same process; are just switched out frequently
#       need to have sleep() in the other thread loops to allow for proper timing of the ultrasonic sensor thread
#       or alternatively run the ultrasonic on a separate process

# ultrasonicThread.join() # the main thread will pause and wait for this thread to complete running.

signal.pause() # The process sleeps until a signal is received (motion detected). And then the signal handler is called.
# otherwise the app will terminate if there is nothing following here

# https://realpython.com/intro-to-python-threading/