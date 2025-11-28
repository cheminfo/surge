FROM node:24

EXPOSE 31228

RUN apt-get update

# Create a non-root user and group with a specific UID and GID with no login shell and no home directory
RUN groupadd -g 10001 appgroup && \
    useradd -u 10001 -g 10001 -s /usr/sbin/nologin -M appuser

RUN mkdir /node
COPY package.json /node/
WORKDIR /node
# We install before copying the source code that is changing during development
RUN npm i 

COPY src /node/src
# This is unusual, we really need to copy binaries from the surge C executable code
COPY bin /node/bin

# We switch at the end to limit what the non-root user can access during the execution
USER appuser

CMD npm start
