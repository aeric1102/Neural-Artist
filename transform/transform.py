import tensorflow as tf
from tensorflow.python.util import deprecation
deprecation._PRINT_DEPRECATION_WARNINGS = False
import os
import numpy as np
import time
import socket
import sys
import model
from PIL import Image

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
def get_img(src, img_size=False):
    img = np.asarray(Image.open(src))
    if not (len(img.shape) == 3 and img.shape[2] == 3):
        img = np.dstack((img,img,img))
    if img_size != False:
        img = np.array(Image.fromarray(img).resize(img_size))
    return img

def save_img(out_path, img):
    img = np.clip(img, 0, 255).astype(np.uint8)
    Image.fromarray(img).save(out_path)

def main():
    def transform(model_path, input_path, output_path):
        # Load model
        saver.restore(sess, model_path)
        # Transform image
        x_input = get_img(input_path)
        x_input = np.expand_dims(x_input, 0)
        y_out = sess.run(preds, feed_dict={img_placeholder: x_input})
        save_img(output_path, y_out[0])
        return

    config = tf.compat.v1.ConfigProto(
        device_count = {'GPU': 0}, 
        inter_op_parallelism_threads=2,
        intra_op_parallelism_threads=2)
    sess = tf.compat.v1.Session(config=config)
    batch_shape = (None, None, None, 3)
    img_placeholder = tf.compat.v1.placeholder(tf.float32, shape=batch_shape,
                                     name='img_placeholder')
    preds = model.create_model(img_placeholder)
    saver = tf.compat.v1.train.Saver()
    # Use socket to serve transform request from node.js
    HOST = "127.0.0.1"  # Standard loopback interface address (localhost)
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.bind((HOST, 0))
    sock.listen(3)
    print("Python start listening on port " + str(sock.getsockname()[1]), flush=True)
    while True:
        try:
            conn, addr = sock.accept()
            data = conn.recv(1024)
            args = data.decode('ascii').split("$")
            st = time.time()
            try:
                transform(*args)
                message = "Complete. Load and predict time: {:.3f}".format(time.time() - st)
                conn.sendall(message.encode("ascii"))
            except Exception as e:
                sys.stderr.write(e)
        finally:
            conn.close()
            # sock.close()
            # return 0
    return 0

if __name__ == '__main__':
    main()

