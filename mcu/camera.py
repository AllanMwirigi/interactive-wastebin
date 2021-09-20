from __future__ import print_function
import cv2 as cv
import os
import argparse

def detectAndDisplay(frame):
    frame_gray = cv.cvtColor(frame, cv.COLOR_BGR2GRAY)
    frame_gray = cv.equalizeHist(frame_gray)
    #-- Detect faces
    faces = face_cascade.detectMultiScale(frame_gray)
    # faces = face_cascade.detectMultiScale(frame_gray, scaleFactor=1.3, minNeighbors=4, minSize=(30, 30),
    #                                  flags=cv.CASCADE_SCALE_IMAGE)
    for (x,y,w,h) in faces:
        center = (x + w//2, y + h//2)
        frame = cv.ellipse(frame, center, (w//2, h//2), 0, 0, 360, (255, 0, 255), 4)

        # faceROI = frame_gray[y:y+h,x:x+w]
        # # in each face, detect eyes
        # eyes = eyes_cascade.detectMultiScale(faceROI)
        # for (x2,y2,w2,h2) in eyes:
        #     eye_center = (x + x2 + w2//2, y + y2 + h2//2)
        #     radius = int(round((w2 + h2)*0.25))
        #     frame = cv.circle(frame, eye_center, radius, (255, 0, 0 ), 4)

    cv.imshow('Capture - Face detection', frame)

cv_base_dir = "/media/allan/SharedVolume/Linux/Programs/opencv"
face_model = os.path.join(cv_base_dir, 'data/haarcascades/haarcascade_frontalface_alt.xml')
# face_model = os.path.join(cv_base_dir, 'data/lbpcascades/lbpcascade_frontalface.xml') # faster, less intensive but less accurate than Haar
# face_model = os.path.join(cv_base_dir, 'data/lbpcascades/lbpcascade_frontalface_improved.xml') # faster, less intensive but less accurate than Haar
# face_model = os.path.join(cv_base_dir, 'data/hogcascades/hogcascade_pedestrians.xml') # also better than Haar
# eyes_model = os.path.join(cv_base_dir, 'data/haarcascades/haarcascade_eye_tree_eyeglasses.xml')

parser = argparse.ArgumentParser(description='Code for Cascade Classifier tutorial.')
parser.add_argument('--face_cascade', help='Path to face cascade.', default=face_model)
# parser.add_argument('--eyes_cascade', help='Path to eyes cascade.', default=eyes_model)
parser.add_argument('--camera', help='Camera divide number.', type=int, default=0)
args = parser.parse_args()
face_cascade_name = args.face_cascade
face_cascade = cv.CascadeClassifier()
# face_cascade = cv.HOGDescriptor()

# eyes_cascade_name = args.eyes_cascade
# eyes_cascade = cv.CascadeClassifier()

# load the cascades
if not face_cascade.load(cv.samples.findFile(face_cascade_name)):
    print('Error loading face cascade')
    exit(0)
# if not eyes_cascade.load(cv.samples.findFile(eyes_cascade_name)):
#     print('--(!)Error loading eyes cascade')
#     exit(0)

camera_device = args.camera
# read the video stream
cap = cv.VideoCapture(camera_device)
if not cap.isOpened:
    print('--(!)Error opening video capture')
    exit(0)

while True:
    ret, frame = cap.read()
    if frame is None:
        print('--(!) No captured frame -- Break!')
        break
    detectAndDisplay(frame)
    if cv.waitKey(10) == 27:
        break

cv.destroyAllWindows()
cap.release()