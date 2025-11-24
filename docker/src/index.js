import fastifyCors from '@fastify/cors';
import fastifyMultipart from '@fastify/multipart';
import fastifySensible from '@fastify/sensible';
import fastifyStatic from '@fastify/static';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import fastifyPkg from 'fastify';

import v1 from './v1/v1.js';
import { join } from 'path';

const fastify = fastifyPkg({
  logger: false,
});

fastify.register(fastifyCors, {
  maxAge: 86400,
});

fastify.register(fastifyMultipart);

fastify.register(fastifySensible);

fastify.register(fastifyStatic, {
  root: join(import.meta.dirname, 'static'),
  prefix: '/', // optional: default '/'
});

await fastify.register(fastifySwagger, {
  swagger: {
    info: {
      title: 'Generate structural isomers from a molecular formula using Surge',
      description: ``,
      version: '1.0.0',
    },
    produces: ['application/json'],
  },
});

await fastify.register(fastifySwaggerUi, {
  routePrefix: '/documentation',
  uiConfig: {
    docExpansion: 'full',
    deepLinking: false,
  },
});

v1(fastify);

await fastify.ready();
fastify.swagger();

// eslint-disable-next-line no-console
console.log('http://localhost:31228');
fastify.listen({ port: 31228, host: '0.0.0.0' }, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
