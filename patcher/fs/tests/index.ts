import test from 'tape';
import { readFolder, applyPatch } from '../dist';
import path from 'path';

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test('read the directory for this package', async t => {
  const d = readFolder(`${__dirname}/../`);



  t.equal(5, Object.keys(d.children).length);
});
