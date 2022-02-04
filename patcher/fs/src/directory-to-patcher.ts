import { Dictionary, PatcherDirectory, PatcherFile, PatcherNode } from '@patcher/types';
import camelCase from 'lodash-es/camelCase';
import uniq from 'lodash-es/uniq';
import flatten from 'lodash-es/flatten';
import { escapeTemplateLiteral, replaceAll } from './utils';

export function directoryToPatcher(
  directory: PatcherDirectory,
  templateLiterals: Dictionary<string>,
): PatcherDirectory {
  const [d, _] = innerDirectoryToPatcher(directory, templateLiterals);
  return d;
}

function innerDirectoryToPatcher(
  directory: PatcherDirectory,
  templateLiterals: Dictionary<string>,
): [PatcherDirectory, string[]] {
  const patcher: PatcherDirectory = {
    type: PatcherNode.Directory,
    children: {},
  };

  const literalsInFile: Dictionary<string[]> = {};

  for (const [childPath, child] of Object.entries(directory.children)) {
    if (child.type === PatcherNode.Directory) {
      const [p, literals] = innerDirectoryToPatcher(child, templateLiterals);
      patcher.children[camelCase(childPath)] = p;
      literalsInFile[childPath] = literals;
    } else {
      const [p, literals] = filePatcher(childPath, child, templateLiterals);
      patcher.children[`${camelCase(childPath)}.ts`] = p;

      literalsInFile[childPath] = literals;
    }
  }

  patcher.children['index.ts'] = dirPatcher(directory, literalsInFile);
  const allLiterals = uniq(flatten(Object.values(literalsInFile)));

  return [patcher, allLiterals];
}

export function filePatcher(
  name: string,
  file: PatcherFile,
  templateLiterals: Dictionary<string>,
): [PatcherFile, string[]] {
  const existingLiterals = Object.keys(templateLiterals).filter(t => file.content.includes(t));

  if (file.content.includes('`')) {
    console.log(file.content, escapeTemplateLiteral(file.content));
  }
  let content = escapeTemplateLiteral(file.content);

  for (const literal of existingLiterals) {
    content = replaceAll(content, literal, `\${${templateLiterals[literal]}}`);
  }

  const varLiterals = existingLiterals.map(l => templateLiterals[l]);

  return [
    {
      type: PatcherNode.File,
      content: `export const ${camelCase(name)} = (${literalsParametersDef(varLiterals)}) => \`${content}\`
    `,
    },
    varLiterals,
  ];
}

function dirPatcher(directory: PatcherDirectory, literalsInFile: Dictionary<string[]>): PatcherFile {
  const allLiterals = uniq(flatten(Object.values(literalsInFile)));

  return {
    type: PatcherNode.File,
    content: `import { PatcherNode } from '@patcher/type'; 

${Object.entries(directory.children)
  .map(
    ([childPath, child]) =>
      `import ${
        child.type === PatcherNode.File ? `{ ${camelCase(childPath)} }` : camelCase(childPath)
      } from './${camelCase(childPath)}';`,
  )
  .join('\n')}  

export default (${literalsParametersDef(allLiterals)}) => ({
  type: PatcherNode.Directory,
  children: {
  ${Object.keys(directory.children)
    .map(child => `'${child}': ${camelCase(child)}(${passParameters(literalsInFile[child])})`)
    .join(',\n  ')}
  }
})`,
  };
}

function literalsParametersDef(literals: string[]): string {
  console.log('hi', literals);
  if (literals.length === 0) return '';

  return `{${literals.join(', ')}}: {${literals.map(l => `${l}: string;`).join(', ')}}`;
}

function passParameters(literals: string[]): string {
  console.log('hi2', literals);
  if (literals.length === 0) return '';

  return `{${literals.join(', ')}}`;
}
