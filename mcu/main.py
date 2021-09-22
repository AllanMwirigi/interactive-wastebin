from gpiozero import MotionSensor, LED
#from time import sleep, time
from signal import pause
import threading
import ultrasonic
import audio

# gpiozero always uses BCM
# NOTE: PIR sensor has 1min initialization period on startup
pir = MotionSensor(4)
# red = LED(19)

motion_detected = False
audioThread = threading.Thread(target=audio.play, daemon=True)
# print("Audio thread alive", audioThread.is_alive)

# A function to detect motion
def on_motion():
    motion_detected = True
    print('Motion detected!')
    # red.off()
    if not audioThread.is_alive():
        audioThread.start()

# A function when no motion is detected
def no_motion():
    motion_detected = False
    # print('No motion detected')
    # red.on()

pir.when_motion = on_motion
pir.when_no_motion = no_motion

# ultrasonic sensor will operaton a separate thread
# x = threading.Thread(target=thread_function, args=(1,)) # When you create a Thread, you pass it a function and a list containing the arguments to that function. In this case, you’re telling the Thread to run thread_function() and to pass it 1 as an argument.
ultrasonicThread = threading.Thread(target=ultrasonic.computeVolume, daemon=True) # daemon indicates that the thread will be killed when main terminates
ultrasonicThread.start()
# ultrasonicThread.join() # the main thread will pause and wait for this thread to complete running.

pause() # The process sleeps until a signal is received (motion detected). And then the signal handler is called.
# otherwise the app will terminate if there is nothing following here

# https://realpython.com/intro-to-python-threading/