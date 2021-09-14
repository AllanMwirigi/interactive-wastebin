import pygame
pygame.mixer.init()
file_path = "/home/allan/Music/going_home.wav"
pygame.mixer.music.load(file_path)
pygame.mixer.music.play()
while pygame.mixer.music.get_busy() == True:
    continue