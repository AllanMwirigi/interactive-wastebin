# https://www.pyimagesearch.com/2019/04/15/live-video-streaming-over-network-with-opencv-and-imagezmq/

from imutils.video import VideoStream
import imagezmq
import argparse
import socket
import time
# construct the argument parser and parse the arguments
ap = argparse.ArgumentParser() 
ap.add_argument("-s", "--server-ip", required=False, default="localhost",
	help="ip address of the server to which the client will connect")
args = vars(ap.parse_args())
# initialize the ImageSender object with the socket address of the
# server
sender = imagezmq.ImageSender(connect_to="tcp://{}:5555".format(args["server_ip"]))

# get the host name, initialize the video stream, and allow the
# camera sensor to warmup
rpiName = socket.gethostname()
# just going to use the maximum resolution so the argument is not provided. But if you find that there is a lag, you are likely sending too many pixels. If that is the case, you may reduce your resolution quite easily. Just pick from one of the resolutions available for the PiCamera V2 here: https://picamera.readthedocs.io/en/release-1.12/fov.html . The second table is for V2.
# Once you’ve chosen the resolution, edit like this: vs = VideoStream(usePiCamera=True, resolution=(320, 240)).start()
# vs = VideoStream(usePiCamera=True).start()
# As an alternative, you can insert a frame = imutils.resize(frame, width=320) between Lines 28 and 29 to resize the frame manually.
vs = VideoStream(src=0).start()
time.sleep(2.0)
 
while True:
	# read the frame from the camera and send it to the server
	frame = vs.read()
    # frame = imutils.resize(frame, width=320)
	sender.send_image(rpiName, frame)

	# TODO: could use the same approach to receive the result of detion from the cam_server