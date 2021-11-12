from fastapi import APIRouter, Query

import os
import time
import cv2
import numpy as np
from glob import glob
import tensorflow as tf
import tensorflow_hub as hub
from starlette.responses import FileResponse

CONTENT_IMAGE_SIZE = (384, 384)
STYLE_IMAGE_SIZE = (256, 256)
model_path = 'https://tfhub.dev/google/magenta/arbitrary-image-stylization-v1-256/2'
stylization_model = None
outputs = "outputs"

# Define Router
router = APIRouter()


@router.get("/style_images")
async def get_style_images():
    # Get the style images
    style_images = glob("examples/style/*.jpg")

    return style_images


@router.get("/content_images")
async def get_content_images():
    # Get the content images
    content_images = glob("examples/content/*.png")

    return content_images


@router.get("/style_transfer")
async def style_transfer(
    style: str = Query(..., description="Style image"),
    content: str = Query(..., description="Content image")
):
    print(style, content)
    global stylization_model
    if stylization_model is None:
        stylization_model = hub.load(model_path)

    # Preprocess the style and content images
    style_image = process_image(style, STYLE_IMAGE_SIZE)
    content_image = process_image(content, CONTENT_IMAGE_SIZE)

    # Perform image style transfer
    outputs = stylization_model(content_image, style_image)
    stylized_image = outputs[0][0]
    print("Output Shape:", stylized_image.shape)

    stylized_image = stylized_image.numpy() * 255
    stylized_image = stylized_image.astype(np.uint8)

    stylized_image_name = "stylized_image-{}.png".format(int(time.time()))

    # Ensure path exists
    if not os.path.exists("outputs"):
        os.mkdir("outputs")

    stylized_image_path = os.path.join(
        "outputs", stylized_image_name)
    print(stylized_image_path)
    cv2.imwrite(stylized_image_path, stylized_image)

    return {
        "stylized_image": stylized_image_path
    }


@router.get("/get_image")
async def get_image(
        image_path: str = Query(..., description="Image Path")
):
    return FileResponse(image_path, media_type="image/png")


def process_image(image_path, image_size):
    # Load and convert to float32
    img = cv2.imread(image_path).astype(np.float32)
    # add batch dimension
    img = img[np.newaxis, ...]
    # normalize
    img = img / 255.

    # Crop
    shape = img.shape
    new_shape = min(shape[1], shape[2])
    offset_y = max(shape[1] - shape[2], 0) // 2
    offset_x = max(shape[2] - shape[1], 0) // 2
    img = tf.image.crop_to_bounding_box(
        img, offset_y, offset_x, new_shape, new_shape)

    img = tf.image.resize(img, image_size, preserve_aspect_ratio=True)

    return img
