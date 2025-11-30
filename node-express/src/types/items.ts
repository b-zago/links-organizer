export type LinkItem = {
  id: number;
  parentId: number | null;
  type: "link";
  url: string;
  title: string;
  description: string | null;
};

export type FolderItem = {
  id: number;
  parentId: number | null;
  type: "folder";
  name: string;
  description: string | null;
  folderContents: Array<FolderItem | LinkItem>;
};

export type HomeFolder = {
  folderContents: Array<FolderItem | LinkItem> | null;
};
