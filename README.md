# surge

[![test coverage](https://img.shields.io/codecov/c/github/cheminfo/surge-docker.svg)](https://codecov.io/gh/cheminfo/surge-docker)
[![license](https://img.shields.io/npm/l/ml-spectra-processing.svg)](https://github.com/cheminfo/surge-docker/blob/main/LICENSE)
[![DOI](https://www.zenodo.org/badge/)](https://www.zenodo.org/badge/latestdoi/)

Webservice allowing to generate structural isomers using surge based on a molecular formula

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
