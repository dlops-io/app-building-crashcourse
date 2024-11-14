#!/bin/bash

set -e

export IMAGE_NAME="app-building-crashcourse-frontend"

# Build the image based on the Dockerfile
docker build -t $IMAGE_NAME -f Dockerfile.dev .

# Run the container
docker run --rm --name $IMAGE_NAME -ti -v "$(pwd)/:/app/" -p 3000:3000 $IMAGE_NAME