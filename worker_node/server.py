import os
import numpy as np
import tensorflow as tf
import tensorflow_hub as tf_hub
from PIL import Image
import zmq
import io


class StyleTransfer:

    def __init__(self):
        self.setStyle("style")
        model_path = "tf_model"
        self.stylize_model = tf_hub.load(model_path)
        pass

    def setStyle(self, style):
        style_image_path = "images"+os.sep+style+".jpeg"
        self.style_image = self.load_image_from_file(style_image_path)
        self.style_image = tf.nn.avg_pool(
            self.style_image, ksize=[3, 3], strides=[1, 1], padding='VALID')

    def load_image(self, image_data, image_size=(1024, 512)):
        img = tf.image.decode_image(image_data, channels=3, dtype=tf.float32)[
            tf.newaxis, ...]
        img = tf.image.resize(img, image_size, preserve_aspect_ratio=True)
        return img

    def load_image_from_file(self, image_path, image_size=(1024, 512)):
        img = tf.io.decode_image(
            tf.io.read_file(image_path),
            channels=3, dtype=tf.float32)[tf.newaxis, ...]
        img = tf.image.resize(img, image_size, preserve_aspect_ratio=True)
        return img

    def export_image(self, tf_img):
        tf_img = tf_img * 255
        tf_img = np.array(tf_img, dtype=np.uint8)
        if np.ndim(tf_img) > 3:
            assert tf_img.shape[0] == 1
            img = tf_img[0]
        return Image.fromarray(img)

    def process(self, source_img_data):
        original_image = self.load_image(source_img_data)
        results = self.stylize_model(tf.constant(
            original_image), tf.constant(self.style_image))
        stylized_img = results[0]
        return stylized_img


context = zmq.Context()

# Socket to receive messages on
receiver = context.socket(zmq.PULL)
receiver.connect("tcp://127.0.0.1:6000")

# Socket to send messages to
sender = context.socket(zmq.PUSH)
Server_URI = os.environ.get("Server_URI")
if Server_URI == None:
    raise Exception('Server_URI not exist!')
print("Connecting to Server {Server_URI}")
sender.connect(Server_URI)

model = StyleTransfer()

# Process tasks forever
while True:
    # TODO Receive from the queue, save it to local cache (in memory), if no data come, freeze, otherwise process the data, and send image back to the queue.
    # Waiting for data
    print("Waiting for data")
    img_buffer = receiver.recv()
    pil_img = Image.open(io.BytesIO(img_buffer))
    # Convert the image to JPEG format
    with io.BytesIO() as output:
        pil_img.save(output, format='JPEG')
        jpeg_data = output.getvalue()
    styled_img = model.process(jpeg_data)
    print("Process complete")
    # Send results to sink
    sender.send(styled_img)
