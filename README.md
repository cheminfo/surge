# surge

[![test coverage](https://img.shields.io/codecov/c/github/cheminfo/surge-docker.svg)](https://codecov.io/gh/cheminfo/surge-docker)
[![license](https://img.shields.io/npm/l/ml-spectra-processing.svg)](https://github.com/cheminfo/surge-docker/blob/main/LICENSE)

Webservice allowing to generate structural isomers using surge based on a molecular formula.

Surge source code is available at: https://github.com/StructureGenerator/surge

## Installation

This project runs as a Docker container. Pick one of the two deployment modes below — both expect a local `.env` file.

### 1. Prepare the `.env` file

```sh
git clone https://github.com/cheminfo/surge
cd surge
cp .env.example .env
```

Edit `.env` if you want to change the service `PORT` (default `31228`). `TUNNEL_TOKEN` is only needed for the Cloudflare Tunnel deployment (see below).

### 2. Choose an image source

All example compose files list both `image: ghcr.io/cheminfo/surge:latest` and `build: .` on the service. Pick one of the two commands at deploy time:

- **Released image** (recommended): `docker compose pull && docker compose up -d`
- **Build locally from the current checkout**: `docker compose up -d --build`

Plain `docker compose up -d` also works — it uses a previously pulled or built image if one exists, and falls back to building if none is present.

### 3a. Standard deployment (port published on the host)

```sh
cp compose.example.yaml compose.yaml
docker compose pull && docker compose up -d   # or: docker compose up -d --build
```

The service is then reachable at `http://localhost:31228/` (or whatever `PORT` you set).

### 3b. Cloudflare Tunnel deployment (public HTTPS, no host port)

Use this to expose the service on the public internet through a Cloudflare Tunnel — no inbound firewall port, no TLS certificate to manage.

```sh
cp compose.example.cloudflared.yaml compose.yaml
docker compose pull && docker compose up -d   # or: docker compose up -d --build
```

One-time setup in the Cloudflare dashboard (https://dash.cloudflare.com):

1. **Networking → Tunnels → Create a tunnel**, pick the **Cloudflared** connector type, give it a name, save.
2. Copy the **tunnel token** shown on the next screen into `.env` as `TUNNEL_TOKEN=…`.
3. Open the tunnel → **Published applications** tab → *Add application*:
   - **Hostname**: `surge.lactame.com` (or any subdomain you control).
   - **Service type**: `HTTP`
   - **URL**: `surge:31228` (the compose service name and the `PORT` from `.env`).

Restart with `docker compose up -d` after editing `.env`.

## Local development

```sh
git clone https://github.com/cheminfo/surge
cd surge
npm install
npm run dev
```

The server reads `PORT` from the environment and defaults to `31228`.

## License

[MIT](./LICENSE)

surge is subject to its own license: https://github.com/cheminfo/surge/blob/main/LICENSE
