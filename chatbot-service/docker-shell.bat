SET IMAGE_NAME="api-server"
docker build -t %IMAGE_NAME% -f Dockerfile .
cd ..
docker run  --rm --name %IMAGE_NAME% -ti ^
            --mount type=bind,source="%cd%\api-service",target=/app ^
            --mount type=bind,source="%cd%\persistent-folder",target=/persistent ^
            -p 9500:9000 -e DEV=1 %IMAGE_NAME%