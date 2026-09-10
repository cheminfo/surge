import {
  applyShareConfig,
  isShareConfigured,
  parseShareConfig,
} from 'react-cheminfo/core';
import { expect, test } from 'vitest';

import { SHARE_VOCABULARY } from '../shareConfig.ts';

const parse = (search: string) => parseShareConfig(search, SHARE_VOCABULARY);
const apply = (search: string, config: ReturnType<typeof parse>) =>
  applyShareConfig(search, config, SHARE_VOCABULARY);

test('a configured link is read back whole', () => {
  expect(
    parse('?formulas=C4H10O,C5H12&embed=1&hide=hints,answers'),
  ).toStrictEqual({
    embed: true,
    hidden: ['hints', 'answers'],
    params: {},
  });
});

test('a plain link configures nothing', () => {
  const config = parse('?mf=C4H10O');
  expect(config).toStrictEqual({ embed: false, hidden: [], params: {} });
  expect(isShareConfigured(config, SHARE_VOCABULARY)).toBe(false);
});

test('a bare ?embed switches embed mode on, ?embed=0 leaves it off', () => {
  expect(parse('?embed').embed).toBe(true);
  expect(parse('?embed=0').embed).toBe(false);
});

test('an unknown or repeated hide key is dropped', () => {
  expect(parse('?hide=hints,ionization,hints, answers').hidden).toStrictEqual([
    'hints',
    'answers',
  ]);
});

test('the configuration is written next to the inputs, which are left alone', () => {
  const query = apply('formulas=C4H10O&exercise=C4H10O&embed=1', {
    embed: false,
    hidden: ['list', 'clear'],
    params: {},
  });

  expect(query).toBe('formulas=C4H10O&exercise=C4H10O&hide=list,clear');
});

test('parse, apply and parse again give the same configuration', () => {
  const config = parse('?embed=1&hide=options,substructure');

  expect(parse(apply('mf=C6H10O', config))).toStrictEqual(config);
});
