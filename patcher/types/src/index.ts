export type Dictionary<T> = { [name: string]: T };

export enum PatcherNodeType {
  Directory,
  File,
}

export interface PatcherDirectory {
  type: PatcherNodeType.Directory;
  children: Dictionary<PatcherDirectory | PatcherFile>;
}

export interface PatcherFile {
  type: PatcherNodeType.File;

  content: string;
}

export type PatcherNode = PatcherDirectory | PatcherFile;
