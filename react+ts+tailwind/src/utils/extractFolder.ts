import type { Folder, HomeFolder, Link } from "../types/types";

// Build index once - O(n) time
export function buildFolderIndex(homeFolder: HomeFolder): Map<number, Folder> {
  const index = new Map<number, Folder>();

  function indexItems(items: Array<Folder | Link>) {
    for (const item of items) {
      if (item.type === "folder") {
        index.set(item.id, item);
        indexItems(item.folderContents);
      }
    }
  }

  if (homeFolder.folderContents) {
    indexItems(homeFolder.folderContents);
  }

  return index;
}

export function getFolderContentsById(
  index: Map<number, Folder>,
  id: number
): Array<Folder | Link> | null {
  const item = index.get(id);
  return item ? item.folderContents : null;
}
