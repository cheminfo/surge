import process from 'node:process';

import { buildServer } from './server.js';

const fastify = await buildServer();

const port = Number(process.env.PORT ?? 31228);

// eslint-disable-next-line no-console
console.log(`http://localhost:${port}`);
fastify.listen({ port, host: '0.0.0.0' }, (err) => {
  if (err) {
    fastify.log.error(err);
    throw new Error('Server failed to start');
  }
});
