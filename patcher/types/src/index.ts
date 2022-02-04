export type Dictionary<T> = { [name: string]: T };

export enum FsNode {
  Directory,
  File,
}

export interface Directory {
  type: FsNode.Directory;
  children: Dictionary<Directory | File>;
}

export interface File {
  type: FsNode.File;

  content: string;
}
