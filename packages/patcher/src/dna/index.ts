import { HappDefinition, ZomeDefinition } from '@holochain/rad-definitions';
import { PatcherDirectory, PatcherNodeType } from '@patcher/types';

import { zome } from '../zome';

import { dnaYaml } from './dna.yaml';

export async function dna(happ: HappDefinition, dnaIndex: number, pathToBase: string): Promise<PatcherDirectory> {
  const dna = happ.dnas[dnaIndex];

  const zomes: PatcherDirectory = {
    type: PatcherNodeType.Directory,
    children: {},
  };

  for (const [zomeIndex, zomeDef] of dna.zomes.entries()) {
    const z = await zome(happ, dnaIndex, zomeIndex);
    zomes.children[zomeDef.name] = z;
  }

  return {
    type: PatcherNodeType.Directory,
    children: {
      workdir: {
        type: PatcherNodeType.Directory,
        children: {
          'dna.yaml': dnaYaml(happ, dnaIndex, pathToBase),
        },
      },
      zomes: zomes,
    },
  };
}
