import os
from PIL import Image
import zmq
import io
import time
import cv2
import mediapipe as mp
import numpy as np

context = zmq.Context()


# Socket to receive messages on
receiver = context.socket(zmq.PULL)
receiver.connect("tcp://172.20.221.78:6000")

# Socket to send messages to
sender = context.socket(zmq.PUSH)
Server_URI = "tcp://0.0.0.0:5999"
sender.bind(Server_URI)
print("Connecting to Server")

# Process tasks forever
while True:
    # TODO Receive from the queue, save it to local cache (in memory), if no data come, freeze, otherwise process the data, and send image back to the queue.
    # Waiting for data
    print("Waiting for data")
    message = []
    while True:
        part = receiver.recv()
        message.append(part)
        if not receiver.getsockopt(zmq.RCVMORE):
            break

    mp_drawing = mp.solutions.drawing_utils
    mp_drawing_styles = mp.solutions.drawing_styles
    mp_face_mesh = mp.solutions.face_mesh
    drawing_spec = mp_drawing.DrawingSpec(thickness=1, circle_radius=1)
    img_name = message[0]
    print(img_name)
    image_data = message[1]
    start_time = time.time()
    # Convert the received data into a NumPy array
    image_array = np.frombuffer(image_data, np.uint8)

    # Decode the array into an image
    image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    with mp_face_mesh.FaceMesh(min_detection_confidence=0.5, min_tracking_confidence=0.5) as face_mesh:
        # To improve performance
        image.flags.writeable = False

        # Detect the face landmarks
        results = face_mesh.process(image)

        # To improve performance
        image.flags.writeable = True

        # Convert back to the BGR color space
        image_rgb = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

        # Draw the face mesh annotations on the image.
        if results.multi_face_landmarks:
            for face_landmarks in results.multi_face_landmarks:
                mp_drawing.draw_landmarks(
                    image=image_rgb,
                    landmark_list=face_landmarks,
                    connections=mp_face_mesh.FACEMESH_TESSELATION,
                    landmark_drawing_spec=None,
                    connection_drawing_spec=mp_drawing_styles.get_default_face_mesh_tesselation_style())

    # Encode the image as a JPEG
    retval, buffer = cv2.imencode('.jpeg', image_rgb)

    # Convert the buffer to a byte array
    img_buffer = buffer.tobytes()
    end_time = time.time()
    print("Process complete, used:"+str(end_time-start_time))
    # Send results to sink
    sender.send_multipart([img_name, img_buffer])
