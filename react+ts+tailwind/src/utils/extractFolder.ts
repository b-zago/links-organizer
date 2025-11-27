import type { Folder, HomeFolder, Link } from "../types/types";

// Build index once - O(n) time
export function buildFolderIndex(
  homeFolder: HomeFolder
): Map<number, Folder | Link> {
  const index = new Map<number, Folder | Link>();

  function indexItems(items: Array<Folder | Link>) {
    for (const item of items) {
      index.set(item.id, item);
      if (item.type === "folder") {
        indexItems(item.folderContents);
      }
    }
  }

  if (homeFolder.folderContents) {
    indexItems(homeFolder.folderContents);
  }

  return index;
}

// Get folder's contents by ID - O(1) time
export function getFolderContentsById(
  index: Map<number, Folder | Link>,
  id: number
): Array<Folder | Link> | null {
  const item = index.get(id);
  if (item?.type === "folder") {
    return item.folderContents;
  }
  return null;
}
