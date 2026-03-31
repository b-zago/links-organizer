// utils/stateHelpers.ts

import type { Folder, Link } from "../types/types";

/**
 * Recursively updates an item in the folder tree immutably
 */
export function updateItemInTree(
  items: Array<Folder | Link>,
  parentFolderId: number,
  itemId: number,
  updates: Partial<Folder> | Partial<Link>,
): Array<Folder | Link> {
  // If we're updating an item at the root level (parentFolderId === 0)
  if (parentFolderId === 0) {
    return items.map((item) => {
      if (item.id === itemId) {
        // Type-safe update based on item type
        if (item.type === "folder") {
          return { ...item, ...updates } as Folder;
        } else {
          return { ...item, ...updates } as Link;
        }
      }
      // If this is a folder, recursively check its contents
      if (item.type === "folder") {
        return {
          ...item,
          folderContents: updateItemInTree(
            item.folderContents,
            parentFolderId,
            itemId,
            updates,
          ),
        };
      }
      return item;
    });
  }

  // We need to find the parent folder and update within it
  return items.map((item) => {
    // If this is the parent folder we're looking for
    if (item.type === "folder" && item.id === parentFolderId) {
      return {
        ...item,
        folderContents: item.folderContents.map((child) => {
          if (child.id === itemId) {
            // Type-safe update based on child type
            if (child.type === "folder") {
              return { ...child, ...updates } as Folder;
            } else {
              return { ...child, ...updates } as Link;
            }
          }
          return child;
        }),
      };
    }

    // If this is a folder but not the parent, recurse into it
    if (item.type === "folder") {
      return {
        ...item,
        folderContents: updateItemInTree(
          item.folderContents,
          parentFolderId,
          itemId,
          updates,
        ),
      };
    }

    return item;
  });
}

/**
 * Adds a new item to the folder tree immutably
 */
export function addItemToTree(
  items: Array<Folder | Link>,
  parentFolderId: number,
  newItem: Folder | Link,
): Array<Folder | Link> {
  // If adding to root (parentFolderId === 0)
  if (parentFolderId === 0) {
    return [...items, newItem];
  }

  // Find the parent folder and add to it
  return items.map((item) => {
    if (item.type === "folder" && item.id === parentFolderId) {
      return {
        ...item,
        folderContents: [...item.folderContents, newItem],
      };
    }

    // Recurse into folders
    if (item.type === "folder") {
      return {
        ...item,
        folderContents: addItemToTree(
          item.folderContents,
          parentFolderId,
          newItem,
        ),
      };
    }

    return item;
  });
}

/**
 * Deletes an item from the folder tree immutably
 */
export function deleteItemFromTree(
  items: Array<Folder | Link>,
  parentFolderId: number,
  itemId: number,
): Array<Folder | Link> {
  // If deleting from root
  if (parentFolderId === 0) {
    return items.filter((item) => item.id !== itemId);
  }

  // Find parent folder and remove from it
  return items.map((item) => {
    if (item.type === "folder" && item.id === parentFolderId) {
      return {
        ...item,
        folderContents: item.folderContents.filter(
          (child) => child.id !== itemId,
        ),
      };
    }

    // Recurse into folders
    if (item.type === "folder") {
      return {
        ...item,
        folderContents: deleteItemFromTree(
          item.folderContents,
          parentFolderId,
          itemId,
        ),
      };
    }

    return item;
  });
}
