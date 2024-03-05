import { doGenerate } from '../generate.js';

describe('generate', () => {
  it('Basic test', async () => {
    let result;
    const response = {
      send: (data) => {
        result = data;
      },
    };
    await doGenerate({ body: { mf: 'C5H10' } }, response);
    expect(result.found).toBe(10);
    expect(result.mf).toBe('C5H10');
    expect(result.result[0]).toStrictEqual({
      smiles: 'CC(=C)CC',
    });
  });

  it('Basic test with limit', async () => {
    let result;
    const response = {
      send: (data) => {
        result = data;
      },
    };
    await doGenerate({ body: { mf: 'C5H10', limit: 2 } }, response);
    expect(result.found).toBe(10);
    expect(result.result).toHaveLength(2);
    expect(result.mf).toBe('C5H10');
    expect(result.result[0]).toBeDefined();
  });
});
