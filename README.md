# surge

Webservice allowing to convert between molecule formats using surge

Surge source code is available at: https://github.com/StructureGenerator/surge

## Installation

This project uses docker. After cloning the project you should do:

`cp docker-compose.example.yml docker-compose.yml`

You can either use a released docker image or build the head. Please change `docker-compose.yml` accordingly.

`docker-compose up --build -d`

This will start a webserver on port 31228

For the browser you can test for example:

`http://localhost:31228/`

## Local developmwent

```
cd docker
docker build . -t surge
docker run -it surge bash
```

## License

[MIT](./LICENSE)

surge is subject to its own license.
