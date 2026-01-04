import { pool } from "../db/db.js";
import type { HomeFolder, LinkItem, FolderItem } from "../types/items.js";

type DbFolder = {
  id: number;
  user_id: number;
  parent_folder_id: number | null;
  name: string;
  description: string | null;
  created_at: Date;
};

type DbLink = {
  id: number;
  user_id: number;
  folder_id: number;
  url: string;
  title: string;
  description: string | null;
  icon_id: number;
};

export async function getFolderTree(userId: number): Promise<HomeFolder> {
  try {
    // Fetch all folders for the user
    const foldersResult = await pool.query<DbFolder>(
      "SELECT id, user_id, parent_folder_id, name, description, created_at FROM folders WHERE user_id = $1 ORDER BY id",
      [userId]
    );

    // Fetch all links for the user
    const linksResult = await pool.query<DbLink>(
      "SELECT id, user_id, folder_id, url, title, description, icon_id FROM links WHERE user_id = $1 ORDER BY id",
      [userId]
    );

    const folders = foldersResult.rows;
    const links = linksResult.rows;

    // Create a map to store folders by their ID for easy lookup
    const folderMap = new Map<number, FolderItem>();

    // Initialize all folders in the map
    folders.forEach((folder) => {
      folderMap.set(folder.id, {
        id: folder.id,
        parentId: folder.parent_folder_id,
        type: "folder",
        name: folder.name,
        description: folder.description,
        folderContents: [],
      });
    });

    // Add links to their respective folders
    links.forEach((link) => {
      const parentFolder = folderMap.get(link.folder_id);
      if (parentFolder) {
        parentFolder.folderContents.push({
          id: link.id,
          parentId: link.folder_id,
          type: "link",
          url: link.url,
          title: link.title,
          description: link.description,
        });
      }
    });

    // Build the tree structure by nesting child folders into parent folders
    const rootItems: (FolderItem | LinkItem)[] = [];

    folders.forEach((folder) => {
      const folderItem = folderMap.get(folder.id);
      if (!folderItem) return;

      if (folder.parent_folder_id === null) {
        // Root level folder
        rootItems.push(folderItem);
      } else {
        // Child folder - add to parent's folderContents
        const parentFolder = folderMap.get(folder.parent_folder_id);
        if (parentFolder) {
          parentFolder.folderContents.push(folderItem);
        }
      }
    });

    return {
      folderContents: rootItems,
    };
  } catch (err) {
    console.error("Database error while fetching folder tree:", err);
    throw new Error("Failed to fetch folder tree");
  }
}
