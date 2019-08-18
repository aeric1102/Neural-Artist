import os
import tensorflow as tf
import tensorflow.python.util.deprecation as deprecation
deprecation._PRINT_DEPRECATION_WARNINGS = False
import numpy as np
import time
import socket
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

def transform(sess, model_path, input_path, output_path):
    # Load model
    meta_graph_def = tf.saved_model.loader.load(
             sess,
            [tf.saved_model.SERVING],
            model_path)
    signature = meta_graph_def.signature_def
    signature_key = tf.saved_model.DEFAULT_SERVING_SIGNATURE_DEF_KEY
    input_key = 'x'
    output_key = 'y'
    x_tensor_name = signature[signature_key].inputs[input_key].name
    y_tensor_name = signature[signature_key].outputs[output_key].name
    x = sess.graph.get_tensor_by_name(x_tensor_name)
    y = sess.graph.get_tensor_by_name(y_tensor_name)
    # Transform image
    x_input = get_img(input_path)
    x_input = np.expand_dims(x_input, 0)
    y_out = sess.run(y, feed_dict={x: x_input})
    save_img(output_path, y_out[0])
    return

def main():
    # Tensorflow config
    config = tf.compat.v1.ConfigProto(device_count = {'GPU': 0})
    sess = tf.compat.v1.Session(config=config)

    # Use socket to serve transform request from node.js
    HOST = "127.0.0.1"  # Standard loopback interface address (localhost)
    PORT = 9527        # Port to listen on (non-privileged ports are > 1023)

    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.bind((HOST, PORT))
    sock.listen(3)
    while True:
        try:
            conn, addr = sock.accept()
            data = conn.recv(1024)
            args = data.decode('ascii').split("$")
            st = time.time()
            transform(sess, *args)
            message = "Completed. Load and predict time: {:.3f}".format(time.time() - st)
            conn.sendall(message.encode("ascii"))
        finally:
            conn.close()
    return 0

if __name__ == '__main__':
    main()