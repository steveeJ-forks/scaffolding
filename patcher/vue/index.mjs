import fs from 'fs';
import { readFolder, directoryToPatcher, applyPatch } from '@patcher/fs';
import { fileURLToPath } from 'url';
import path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const d = readFolder(`${__dirname}/template`);

const patched = directoryToPatcher(d, {});

if (!fs.existsSync('./src')) fs.mkdirSync('./src');

applyPatch(`${__dirname}/src/app`, patched);
