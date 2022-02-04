import { Directory, FsNode } from '@patcher/types';
import { readdirSync, writeFileSync, mkdirSync, rmSync, rmdirSync } from 'fs';
import { isDirectory } from './utils';

export function applyPatch(sourcePath: string, targetFs: Directory): void {
  const paths = readdirSync(sourcePath);

  for (const [childPath, child] of Object.entries(targetFs.children)) {
    const fullChildPath = `${sourcePath}/${childPath}`;

    if (child.type === FsNode.Directory) {
      if (!paths.includes(childPath)) {
        mkdirSync(fullChildPath);
      }

      applyPatch(fullChildPath, child);
    } else {
      writeFileSync(fullChildPath, child.content);
    }
  }

  // Remove the existing files that are not in the children
  const pathsToRemove = paths.filter(path => !Object.keys(targetFs.children).includes(path));

  for (const pathToRemove of pathsToRemove) {
    if (isDirectory(pathToRemove)) {
      rmdirSync(pathToRemove);
    } else {
      rmSync(pathToRemove);
    }
  }
}
