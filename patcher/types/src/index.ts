export type Dictionary<T> = { [name: string]: T };

export enum PatcherNode {
  Directory,
  File,
}

export interface PatcherDirectory {
  type: PatcherNode.Directory;
  children: Dictionary<PatcherDirectory | PatcherFile>;
}

export interface PatcherFile {
  type: PatcherNode.File;

  content: string;
}
