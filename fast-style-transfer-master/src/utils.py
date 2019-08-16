import scipy.misc, numpy as np, os, sys
from PIL import Image

def save_img(out_path, img):
    img = np.clip(img, 0, 255).astype(np.uint8)
    #scipy.misc.imsave(out_path, img)
    Image.fromarray(img).save(out_path)

def scale_img(style_path, style_scale):
    scale = float(style_scale)
    #o0, o1, o2 = scipy.misc.imread(style_path, mode='RGB').shape
    o0, o1, o2 = np.asarray(Image.open(src)).shape
    scale = float(style_scale)
    new_shape = (int(o0 * scale), int(o1 * scale), o2)
    style_target = _get_img(style_path, img_size=new_shape)
    return style_target

def get_img(src, img_size=False):
   #img = scipy.misc.imread(src, mode='RGB') # misc.imresize(, (256, 256, 3))
   img = np.asarray(Image.open(src))
   if not (len(img.shape) == 3 and img.shape[2] == 3):
       img = np.dstack((img,img,img))
   if img_size != False:
       img = np.array(Image.fromarray(img).resize(img_size))
   return img

def exists(p, msg):
    assert os.path.exists(p), msg

def list_files(in_path):
    files = []
    for (dirpath, dirnames, filenames) in os.walk(in_path):
        files.extend(filenames)
        break

    return files

