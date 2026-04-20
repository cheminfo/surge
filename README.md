# surge

[![test coverage](https://img.shields.io/codecov/c/github/cheminfo/surge-docker.svg)](https://codecov.io/gh/cheminfo/surge-docker)
[![license](https://img.shields.io/npm/l/ml-spectra-processing.svg)](https://github.com/cheminfo/surge-docker/blob/main/LICENSE)

Webservice allowing to generate structural isomers using surge based on a molecular formula.

Surge source code is available at: https://github.com/StructureGenerator/surge

## Installation

This project runs as a Docker container. Pick one of the two deployment modes below — both expect a local `.env` file.

### 1. Prepare the `.env` file

```sh
git clone https://github.com/cheminfo/surge-docker
cd surge-docker
cp .env.example .env
```

Edit `.env` if you want to change the service `PORT` (default `31228`). `TUNNEL_TOKEN` is only needed for the Cloudflare Tunnel deployment (see below).

### 2a. Standard deployment (port published on the host)

```sh
cp compose.example.yaml compose.yaml
docker compose up -d
```

The service is then reachable at `http://localhost:31228/` (or whatever `PORT` you set).

### 2b. Cloudflare Tunnel deployment (public HTTPS, no host port)

Use this to expose the service on the public internet through a Cloudflare Tunnel — no inbound firewall port, no TLS certificate to manage.

```sh
cp compose.example.cloudflared.yaml compose.yaml
docker compose up -d
```

One-time setup in the Cloudflare Zero Trust dashboard (https://one.dash.cloudflare.com):

1. **Networks → Tunnels → Create a tunnel** (pick the *Cloudflared* connector type), give it a name, save.
2. Copy the **tunnel token** shown on the next screen into `.env` as `TUNNEL_TOKEN=…`.
3. Open the tunnel → **Public Hostname** tab → *Add a public hostname*:
   - **Hostname**: `surge.lactame.com` (or any subdomain you control).
   - **Service type**: `HTTP`
   - **URL**: `surge:31228` (the compose service name and the `PORT` from `.env`).

Restart with `docker compose up -d` after editing `.env`.

## Local development

```sh
git clone https://github.com/cheminfo/surge-docker
cd surge-docker
npm install
npm run dev
```

The server reads `PORT` from the environment and defaults to `31228`.

## License

[MIT](./LICENSE)

surge is subject to its own license: https://github.com/cheminfo/surge/blob/main/LICENSE
