import { spawnSync } from 'node:child_process';

import { MF } from 'mf-parser';
import { Molecule, SSSearcher } from 'openchemlib';

import { getExecutable } from './utils/getExecutable.js';

const EXECUTABLE = getExecutable();

export default function generate(fastify) {
  fastify.route({
    url: '/v1/generate',
    method: ['GET', 'POST'],
    handler: doGenerate,
    schema: {
      summary: 'Generate structural isomers from a molecular formula',
      description:
        'Using MayGen we generate structural isomers from a molecular formula',
      consumes: ['multipart/form-data'],
      querystring: {
        type: 'object',
        properties: {
          mf: {
            description: 'Molecular formula',
            type: 'string',
          },
          limit: {
            description: 'Max number of entries',
            type: 'number',
            default: 1000,
          },
          timeout: {
            description: 'Max number of seconds (must be under 30)',
            type: 'number',
            default: 2,
          },
          disallowTripleBonds: {
            description: 'Disallow triple bond',
            type: 'boolean',
            default: false,
          },
          requirePlanarity: {
            description: 'Require planarity',
            type: 'boolean',
            default: false,
          },
          limit3Rings: {
            description:
              'Limit number of rings of length 3 in the format max or min:max',
            type: 'string',
            default: '',
          },
          limit4Rings: {
            description:
              'Limit number of rings of length 4 in the format max or min:max',
            type: 'string',
            default: '',
          },
          limit5Rings: {
            description:
              'Limit number of rings of length 5 in the format max or min:max',
            type: 'string',
            default: '',
          },
          noSmallRingsTripleBonds: {
            description: 'No triple bonds in rings up to length 7',
            type: 'boolean',
            default: false,
          },
          bredsRuleOne: {
            description:
              "Bredt's rule for two rings ij with one bond in common (33, 34, 35, 36, 44, 45)",
            type: 'boolean',
            default: false,
          },
          bredsRuleTwo: {
            description:
              "Bredt's rule for two rings ij with two bonds in common (i,j up to 56)",
            type: 'boolean',
            default: false,
          },
          bredsRuleThree: {
            description:
              "Bredt's rule for two rings of length 6 sharing three bonds",
            type: 'boolean',
            default: false,
          },
          noK33K24: {
            description: 'no K_33 or K_24 structure',
            type: 'boolean',
            default: false,
          },
          noCone: {
            description: 'none of cone of P4 or K4 with 3-ear',
            type: 'boolean',
            default: false,
          },

          noAllene: {
            description: 'No substructures A=A=A (in ring or not)',
            type: 'boolean',
            default: false,
          },
          noAlleneInSmallRings: {
            description: 'No substructures A=A=A in rings up to length 8',
            type: 'boolean',
            default: false,
          },
          noSmallRingsCommonAtoms: {
            description: 'no atom in more than one ring of length 3 or 4',
            type: 'boolean',
            default: false,
          },

          fragmentCode: {
            description: 'Substructure search to filter results',
            type: 'string',
          },
          idCode: {
            description: 'Append openchemlib idCode',
            type: 'boolean',
          },
        },
      },
    },
  });
}

export async function doGenerate(request, response) {
  const params = request.body || request.query;
  try {
    params.mf = new MF(params.mf).getInfo().mf.replaceAll(/[^A-Za-z0-9]/g, '');
    let flags = ['-S'];
    // retrieve smiles rather than molfiles
    if (params.disallowTripleBonds) flags.push('-T'); // disallow triple bond
    if (params.requirePlanarity) flags.push('-P'); // Require planarity
    if (params.limit3Rings !== undefined && params.limit3Rings !== '') {
      flags.push(`-t${params.limit3Rings}`);
    } // Limit number of rings of length 3
    if (params.limit4Rings !== undefined && params.limit4Rings !== '') {
      flags.push(`-f${params.limit4Rings}`);
    } // Limit number of rings of length 4
    if (params.limit5Rings !== undefined && params.limit5Rings !== '') {
      flags.push(`-p${params.limit5Rings}`);
    } // Limit number of rings of length 5

    const filters = [];
    if (params.noSmallRingsTripleBonds) filters.push(1);
    if (params.bredsRuleOne) filters.push(2);
    if (params.bredsRuleTwo) filters.push(3);
    if (params.bredsRuleThree) filters.push(4);
    if (params.noAllene) filters.push(5);
    if (params.noAlleneInSmallRings) filters.push(6);
    if (params.noK33K24) filters.push(7);
    if (params.noCone) filters.push(8);
    if (params.noSmallRingsCommonAtoms) filters.push(9);

    if (filters.length > 0) flags.push(`-B${filters.join(',')}`); // filters

    // flags.push('-oFILE'); // smiles
    // flags.push('-u'); // only count

    /*
     -B#,...,# Specify sets of substructures to avoid (details in manual)
         1 = no triple bonds in rings up to length 7
         2 = Bredt's rule for two rings ij with one bond in
             common (33, 34, 35, 36, 44, 45)
         3 = Bredt's rule for two rings ij with two bonds in
             common (i,j up to 56)
         4 = Bredt's rule for two rings of length 6 sharing three bonds
         5 = no substructures A=A=A (in ring or not)
         6 = no substructures A=A=A in rings up to length 8
             For -B5 and -B6, the central atom only has 2 non-H neighbours
         7 = no K_33 or K_24 structure
         8 = none of cone of P4 or K4 with 3-ear
         9 = no atom in more than one ring of length 3 or 4
         */

    flags.push(params.mf);

    const info = {};
    const start = Date.now();
    const exeResult = spawnSync(EXECUTABLE, flags, {
      encoding: 'utf8',
      maxBuffer: 1024 * 1024 * 512, // default is 1024 * 1024 and max string is 512Mb
      timeout: Math.max(Math.min((params.timeout || 2) * 1000, 30000), 2000),
    });
    info.time = Date.now() - start;

    const smiles = exeResult.stdout.split('\n').filter(Boolean);
    const stderr = exeResult.stderr;

    info.log = stderr;

    if (smiles.length <= params.limit) {
      info.status = 'Partial result';
    } else {
      info.status = 'OK';
    }
    const result = enhancedSmiles(smiles, params, info);
    response.send(result);
  } catch (error) {
    response.send({
      result: [],
      log: error.toString(),
      status: `error: ${error.toString()}`,
    });
  }
}

function enhancedSmiles(smiles, params, info) {
  const { limit, idCode, fragmentCode } = params;
  let searcher = null;
  let fragment = null;
  if (fragmentCode) {
    fragment = Molecule.fromIDCode(fragmentCode);
    searcher = new SSSearcher();
    searcher.setFragment(fragment);
  }
  const results = {
    found: smiles.length,
    ...info,
    mf: params.mf,
    result: [],
  };
  if (smiles.length > limit) {
    smiles.sort(() => Math.random() - 0.5);
  }
  // apparently this library can return twice the same molecule we check ourself
  const uniqueSmiles = {};
  const uniqueIDCodes = {};
  for (const line of smiles.slice(0, limit)) {
    if (uniqueSmiles[line]) continue;
    uniqueSmiles[line] = true;
    const entry = { smiles: line };
    if (idCode || fragment) {
      const molecule = Molecule.fromSmiles(line);
      if (searcher) {
        searcher.setMolecule(molecule);
        if (!searcher.isFragmentInMolecule()) continue;
      }
      molecule.stripStereoInformation();
      entry.idCode = molecule.getIDCode();
      if (uniqueIDCodes[entry.idCode]) continue;
      uniqueIDCodes[entry.idCode] = true;
    }
    results.result.push(entry);
  }
  return results;
}
