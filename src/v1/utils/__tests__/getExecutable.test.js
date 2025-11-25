import { test, expect } from 'vitest';

import { getExecutable } from '../getExecutable';

test('getExecutable', () => {
  const executable = getExecutable();
  expect(executable).toBeDefined();
});
