# https://www.pyimagesearch.com/2019/09/02/opencv-stream-video-to-web-browser-html-page/
# https://www.pyimagesearch.com/2019/04/15/live-video-streaming-over-network-with-opencv-and-imagezmq/
# https://www.pyimagesearch.com/2017/09/11/object-detection-with-deep-learning-and-opencv/
# https://github.com/robmarkcole/object-detection-app/tree/master/model

import numpy as np
import imutils
from imutils.video import VideoStream
import threading
import datetime
import time
import cv2

# opencv motion detection with just camera
# https://www.pyimagesearch.com/2019/09/02/opencv-stream-video-to-web-browser-html-page/

class SingleMotionDetector:
    def __init__(self, accumWeight=0.5):
        # store the accumulated weight factor
        self.accumWeight = accumWeight
        # initialize the background model
        self.bg = None
    
    def update(self, image):
        # if the background model is None, initialize it
        if self.bg is None:
            self.bg = image.copy().astype("float")
            return
        # update the background model by accumulating the weighted
        # average
        cv2.accumulateWeighted(image, self.bg, self.accumWeight)

    def detect(self, image, tVal=25):
        # compute the absolute difference between the background model
        # and the image passed in, then threshold the delta image
        delta = cv2.absdiff(self.bg.astype("uint8"), image)
        thresh = cv2.threshold(delta, tVal, 255, cv2.THRESH_BINARY)[1]
        # perform a series of erosions and dilations to remove small
        # blobs
        thresh = cv2.erode(thresh, None, iterations=2)
        thresh = cv2.dilate(thresh, None, iterations=2)

        # find contours in the thresholded image and initialize the
        # minimum and maximum bounding box regions for motion
        cnts = cv2.findContours(thresh.copy(), cv2.RETR_EXTERNAL,
            cv2.CHAIN_APPROX_SIMPLE)
        cnts = imutils.grab_contours(cnts)
        (minX, minY) = (np.inf, np.inf)
        (maxX, maxY) = (-np.inf, -np.inf)

        # if no contours were found, return None
        if len(cnts) == 0:
            return None
        # otherwise, loop over the contours
        for c in cnts:
            # compute the bounding box of the contour and use it to
            # update the minimum and maximum bounding box regions
            (x, y, w, h) = cv2.boundingRect(c)
            (minX, minY) = (min(minX, x), min(minY, y))
            (maxX, maxY) = (max(maxX, x + w), max(maxY, y + h))
        # otherwise, return a tuple of the thresholded image along
        # with bounding box
        return (thresh, (minX, minY, maxX, maxY))

# initialize the output frame and a lock used to ensure thread-safe
# exchanges of the output frames (useful when multiple browsers/tabs
# are viewing the stream)
outputFrame = None
lock = threading.Lock()
# initialize a flask object
# app = Flask(__name__)
# initialize the video stream and allow the camera sensor to
# warmup
#vs = VideoStream(usePiCamera=1).start()
vs = VideoStream(src=0).start()
time.sleep(2.0)
# grab global references to the video stream, output frame, and
# lock variables
# initialize the motion detector and the total number of frames
# read thus far
md = SingleMotionDetector(accumWeight=0.1)
frameCount = 32
total = 0     

# loop over frames from the video stream
while True:
    # read the next frame from the video stream, resize it,
    # convert the frame to grayscale, and blur it
    frame = vs.read()

    # IMPORTANT !! (the smaller our input frame is, the less data there is, and thus the faster our algorithms will run).
    # restore this - was removed temp for viewing on comp
    frame = imutils.resize(frame, width=600)

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    gray = cv2.GaussianBlur(gray, (7, 7), 0)
    # grab the current timestamp and draw it on the frame
    timestamp = datetime.datetime.now()
    cv2.putText(frame, timestamp.strftime(
        "%A %d %B %Y %I:%M:%S%p"), (10, frame.shape[0] - 10),
        cv2.FONT_HERSHEY_SIMPLEX, 0.35, (0, 0, 255), 1)

    # if the total number of frames has reached a sufficient
    # number to construct a reasonable background model, then
    # continue to process the frame
    if total > frameCount:
        # detect motion in the image
        motion = md.detect(gray)
        # check to see if motion was found in the frame
        if motion is not None:
            # unpack the tuple and draw the box surrounding the
            # "motion area" on the output frame
            (thresh, (minX, minY, maxX, maxY)) = motion
            cv2.rectangle(frame, (minX, minY), (maxX, maxY),
                (0, 0, 255), 2)
    
    # update the background model and increment the total number
    # of frames read thus far
    md.update(gray)
    total += 1
    # # acquire the lock, set the output frame, and release the
    # # lock
    # with lock:
    #     outputFrame = frame.copy()

    cv2.imshow('Capture - Face detection', frame)

    if cv2.waitKey(10) == 27:
        break

cv2.destroyAllWindows()
vs.stop()