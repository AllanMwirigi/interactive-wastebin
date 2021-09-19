import pygame
# NOTE: for pygame to work in virtualenv on Pi, it seems need to install libsdl2-mixer-2.0-0 - sudo apt-get install libsdl2-mixer-2.0-0
pygame.mixer.init()
file_path = "/home/allan/Music/going_home.wav"
pygame.mixer.music.load(file_path)
pygame.mixer.music.play()
while pygame.mixer.music.get_busy() == True:
    continue