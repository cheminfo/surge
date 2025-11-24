FROM node:24

EXPOSE 31228

RUN apt-get update

RUN mkdir /node
COPY package.json /node/
WORKDIR /node
# We install before copying the source code that is changing during development
RUN npm i 

COPY src /node/src
COPY bin /node/bin

CMD npm start

#CMD bash