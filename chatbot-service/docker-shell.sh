#!/bin/bash

# exit immediately if a command exits with a non-zero status
set -e

# Define some environement variables
export IMAGE_NAME="chatbot-server"
export BASE_DIR=$(pwd)

# Build the image based on the Dockerfile
docker build -t $IMAGE_NAME -f Dockerfile .

# Run the container
docker run --rm --name $IMAGE_NAME -ti \
--mount type=bind,source="$BASE_DIR",target=/app \
-p 9001:9000 \
-e HUGGING_FACE_HUB_TOKEN=$HUGGING_FACE_HUB_TOKEN \
-e DEV=1 $IMAGE_NAME