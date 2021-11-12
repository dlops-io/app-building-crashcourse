from fastapi import APIRouter
import tensorflow as tf
import tensorflow_hub as hub
from fastapi import File
from tempfile import TemporaryDirectory

import os
import requests
from PIL import Image
from io import BytesIO

import matplotlib.pyplot as plt
import numpy as np


image_size = 224
dynamic_size = False

model_name = "efficientnetv2-s"
model_image_size_map = 384
model_handle = "https://tfhub.dev/google/imagenet/efficientnet_v2_imagenet1k_s/classification/2"
print(f"Selected model: {model_name} : {model_handle}")

labels_file = "https://storage.googleapis.com/download.tensorflow.org/data/ImageNetLabels.txt"

# download labels and creates a maps
downloaded_file = tf.keras.utils.get_file("labels.txt", origin=labels_file)

classes = []

with open(downloaded_file) as f:
    labels = f.readlines()
    classes = [l.strip() for l in labels]

# Define Router
router = APIRouter()

classifier = None


def preprocess_image(image):
    image = np.array(image)
    # reshape into shape [batch_size, height, width, num_channels]
    img_reshaped = tf.reshape(
        image, [1, image.shape[0], image.shape[1], image.shape[2]])
    # Use `convert_image_dtype` to convert to floats in the [0,1] range.
    image = tf.image.convert_image_dtype(img_reshaped, tf.float32)
    return image


@router.post("/predict")
async def predict(
        file: bytes = File(...)
):
    print("predict file:", len(file), type(file))

    global classifier
    if classifier is None:
        classifier = hub.load(model_handle)

    prediction_results = {}

    image = Image.open(BytesIO(file))
    image = preprocess_image(image)
    print(type(image))

    if tf.reduce_max(image) > 1.0:
        image = image / 255.
    if len(image.shape) == 3:
        image = tf.stack([image, image, image], axis=-1)

    image = tf.image.resize_with_pad(image, image_size, image_size)

    # Run model on image
    probabilities = tf.nn.softmax(classifier(image)).numpy()

    top_5 = tf.argsort(probabilities, axis=-1,
                       direction="DESCENDING")[0][:5].numpy()
    np_classes = np.array(classes)
    print(type(top_5), top_5, type(np_classes), np_classes)

    # prediction_results["top_5"] = top_5.tolist()
    # prediction_results["np_classes"] = np_classes.tolist()

    # Some models include an additional 'background' class in the predictions, so
    # we must account for this when reading the class labels.
    includes_background_class = probabilities.shape[1] == 1001

    results = []
    for i, item in enumerate(top_5):
        class_index = item if includes_background_class else item + 1

        result = {
            "class_index": int(class_index),
            "class_name": classes[class_index],
            "probability": float(probabilities[0][top_5][i])
        }
        results.append(result)

    prediction_results["results"] = results
    print(prediction_results)

    return prediction_results
