docker build -t data-service .
docker tag data-service xucito/data-service
docker push xucito/data-service
PAUSE