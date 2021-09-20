'''
face detection using haar cascades

USAGE:
    facedetect.py [--cascade <cascade_fn>] [--nested-cascade <cascade_fn>] [<video_source>]
'''

# Python 2/3 compatibility
from __future__ import print_function

import numpy as np
import os
import cv2 as cv

# haar_cascade face detection in data/samples


def detect(img, cascade):
    # rects = cascade.detectMultiScale(img, scaleFactor=1.3, minNeighbors=4, minSize=(30, 30),
    #                                  flags=cv.CASCADE_SCALE_IMAGE)
    rects = cascade.detectMultiScale(img)
    if len(rects) == 0:
        return []
    rects[:,2:] += rects[:,:2]
    return rects

def draw_rects(img, rects, color):
    for x1, y1, x2, y2 in rects:
        cv.rectangle(img, (x1, y1), (x2, y2), color, 2)

def clock():
    return cv.getTickCount() / cv.getTickFrequency()

def draw_str(dst, target, s):
    x, y = target
    cv.putText(dst, s, (x+1, y+1), cv.FONT_HERSHEY_PLAIN, 1.0, (0, 0, 0), thickness = 2, lineType=cv.LINE_AA)
    cv.putText(dst, s, (x, y), cv.FONT_HERSHEY_PLAIN, 1.0, (255, 255, 255), lineType=cv.LINE_AA)

def main():
    import sys, getopt

    args, video_src = getopt.getopt(sys.argv[1:], '', ['cascade=', 'nested-cascade='])
    try:
        video_src = video_src[0]
    except:
        video_src = 0
    args = dict(args)
    cv_base_dir = "/media/allan/SharedVolume/Linux/Programs/opencv"
    face_model = os.path.join(cv_base_dir, 'data/haarcascades/haarcascade_frontalface_alt.xml')
    cascade_fn = args.get('--cascade', face_model)
    # nested_fn  = args.get('--nested-cascade', "data/haarcascades/haarcascade_eye.xml")

    cascade = cv.CascadeClassifier(cv.samples.findFile(cascade_fn))
    # nested = cv.CascadeClassifier(cv.samples.findFile(nested_fn))

    # cam = create_capture(video_src, fallback='synth:bg={}:noise=0.05'.format(cv.samples.findFile('samples/data/lena.jpg')))
    cap = cv.VideoCapture(0)


    while True:
        _ret, img = cap.read()
        gray = cv.cvtColor(img, cv.COLOR_BGR2GRAY)
        gray = cv.equalizeHist(gray)

        t = clock()
        rects = detect(gray, cascade)
        vis = img.copy()
        draw_rects(vis, rects, (0, 255, 0))
        # if not nested.empty():
        #     for x1, y1, x2, y2 in rects:
        #         roi = gray[y1:y2, x1:x2]
        #         vis_roi = vis[y1:y2, x1:x2]
        #         subrects = detect(roi.copy(), nested)
        #         draw_rects(vis_roi, subrects, (255, 0, 0))
        dt = clock() - t

        draw_str(vis, (20, 20), 'time: %.1f ms' % (dt*1000))
        cv.imshow('facedetect', vis)

        if cv.waitKey(5) == 27:
            cap.release()
            break

    print('Done')


if __name__ == '__main__':
    print(__doc__)
    main()
    cv.destroyAllWindows()