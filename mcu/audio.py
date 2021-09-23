import pygame
# NOTE: for pygame to work in virtualenv on Pi, it seems need to install libsdl2-mixer-2.0-0 - sudo apt-get install libsdl2-mixer-2.0-0
import os
import time
from dotenv import load_dotenv

load_dotenv()

def play():
    pygame.mixer.init()
    audio_dir = os.getenv("AUDIO_DIR")
    file_path = os.path.join(audio_dir, "going_home_short.wav")
    pygame.mixer.music.load(file_path)
    pygame.mixer.music.play()
    time.sleep(50)
    # mixer.music.pause()   
    # mixer.music.unpause()
    # mixer.music.stop()
    # print ("Audio play")
    # while pygame.mixer.music.get_busy() == True:
    #     continue
    # print ("Audio ended")