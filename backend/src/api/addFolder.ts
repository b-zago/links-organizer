import { pool } from "../db/db.js";
import type { UserJwtPayload } from "../types/express.js";

type FolderData = {
  folderName: string;
  description: string | null;
  parentFolderID: number;
};

type FolderRow = {
  id: number;
  user_id: number;
  parent_folder_id: number;
  name: string;
  description: string | null;
  created_at: Date;
};

export async function addFolder(
  folderData: FolderData,
  userData: UserJwtPayload
): Promise<FolderRow> {
  console.log(folderData, userData);

  const userID = userData.id;
  const parentFolderID =
    folderData.parentFolderID === 0 ? null : folderData.parentFolderID;
  const name = folderData.folderName;
  const description = folderData.description;

  console.log(parentFolderID);

  const insertQuery =
    "INSERT INTO folders (user_id, parent_folder_id, name, description) VALUES ($1, $2, $3, $4) RETURNING *";

  try {
    const result = await pool.query(insertQuery, [
      userID,
      parentFolderID,
      name,
      description,
    ]);
    return result.rows[0];
  } catch (err: any) {
    // Handle unique constraint violation (duplicate folder name in same parent)
    if (err.code === "23505") {
      throw new Error(
        "A folder with this name already exists in the parent folder"
      );
    }

    // Handle foreign key violation (invalid parent_folder_id or user_id)
    if (err.code === "23503") {
      throw new Error("Invalid parent folder or user reference");
    }

    // Handle any other database errors
    console.error("Database error while adding folder:", err);
    throw new Error("Failed to create folder");
  }
}
