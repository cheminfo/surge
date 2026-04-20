import { afterAll, beforeAll, expect, test } from 'vitest';

import { buildServer } from '../server.js';

let fastify;

beforeAll(async () => {
  fastify = await buildServer();
});

afterAll(async () => {
  await fastify.close();
});

test('GET /documentation/ returns the Swagger UI page', async () => {
  const response = await fastify.inject({
    method: 'GET',
    url: '/documentation/',
  });

  expect(response.statusCode).toBe(200);
  expect(response.headers['content-type']).toContain('text/html');
  expect(response.body).toContain('Swagger UI');
});

test('Swagger UI static assets are served under /documentation/static/*', async () => {
  // Regression test for https://github.com/fastify/fastify-static/issues/573:
  // @fastify/static 9.1.1 broke the encapsulated wildcard handler so these
  // assets returned 404 and the Swagger page rendered blank.
  const response = await fastify.inject({
    method: 'GET',
    url: '/documentation/static/index.css',
  });

  expect(response.statusCode).toBe(200);
  expect(response.headers['content-type']).toContain('text/css');
});

test('GET /v1/generate?mf=C5H10 returns structural isomers', async () => {
  const response = await fastify.inject({
    method: 'GET',
    url: '/v1/generate?mf=C5H10&limit=5',
  });

  expect(response.statusCode).toBe(200);

  const body = response.json();

  expect(body.mf).toBe('C5H10');
  expect(body.found).toBe(10);
  expect(body.result).toHaveLength(5);
  expect(body.result[0].smiles).toBeTypeOf('string');
});
