import pygame
# NOTE: for pygame to work in virtualenv on Pi, it seems need to install libsdl2-mixer-2.0-0 - sudo apt-get install libsdl2-mixer-2.0-0
import os
import time
from dotenv import load_dotenv

load_dotenv()

# audio tracks
audioTracks = [
    {'fileName': 'bin-intro.wav', 'duration': 13},
    {'fileName': 'bin-full.wav', 'duration': 7},
]
cacheFileName = 'cache.txt'
thresholdHeight = 9.88

def play():
    pygame.mixer.init()
    audio_dir = os.getenv("AUDIO_DIR")
    # file_path = os.path.join(audio_dir, "Bin.wav")
    audioTrack = audioTracks[0]
    if os.path.exists(cacheFileName):
        with open(cacheFileName, 'r') as reader:
            prevHeight = float(reader.readline())
            if prevHeight <= 9.88:
                audioTrack = audioTracks[1]

    file_path = os.path.join(audio_dir, audioTrack['fileName'])
    pygame.mixer.music.load(file_path)
    pygame.mixer.music.play()
    # time.sleep(13)
    time.sleep(audioTrack['duration'])

    # mixer.music.pause()   
    # mixer.music.unpause()
    # mixer.music.stop()
    # print ("Audio play")
    # while pygame.mixer.music.get_busy() == True:
    #     continue
    # print ("Audio ended")