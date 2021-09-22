import pygame
# NOTE: for pygame to work in virtualenv on Pi, it seems need to install libsdl2-mixer-2.0-0 - sudo apt-get install libsdl2-mixer-2.0-0
import os

pygame.mixer.init()
audio_dir = os.getenv("AUDIO_DIR")
file_path = os.path.join(audio_dir, "going_home.wav")
pygame.mixer.music.load(file_path)
pygame.mixer.music.play()
while pygame.mixer.music.get_busy() == True:
    continue