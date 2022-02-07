import test from 'tape';
import { webHapp } from '../dist';
import path from 'path';
import { applyPatch } from '@patcher/fs';

import { fileURLToPath } from 'url';
import { PatcherNodeType } from '@patcher/types';
// @ts-ignore
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test('generate a full blown happ', async t => {
  const happChanges = await webHapp(
    {
      name: 'haha',
      dnas: [
        {
          name: 'hehe',
          zomes: [
            {
              name: 'hihi',
              entry_defs: [
                {
                  name: 'sample_entry',
                  create: true,
                  update: true,
                  delete: false,
                  read: true,
                  sample: { foo: 'hi', bar: 3 },
                },
                {
                  name: 'sample_entry2',
                  create: true,
                  update: false,
                  delete: false,
                  read: true,
                  sample: { foo: 'hi', bar: 3 },
                },
              ],
            },
            {
              name: 'hihi2',
              entry_defs: [
                {
                  name: 'sample_entry',
                  create: true,
                  update: false,
                  delete: true,
                  read: false,
                  sample: { foo: 'hi', bar: 3 },
                },
              ],
            },
          ],
        },
        {
          name: 'hehe2',
          zomes: [
            {
              name: 'hihi',
              entry_defs: [
                {
                  name: 'sample_entry',
                  create: true,
                  update: false,
                  delete: false,
                  read: true,
                  sample: { foo: 'hi', bar: 3 },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: PatcherNodeType.Directory,
      children: {},
    },
  );

  applyPatch(__dirname + '/.fixture', happChanges);

  t.equal(1, 1);
  t.end();
});
