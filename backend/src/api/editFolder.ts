import { pool } from "../db/db.js";
import type { UserJwtPayload } from "../types/express.js";

type EditFolderData = {
  folderName: string;
  description: string | null;
  id: number;
};

type FolderRow = {
  id: number;
  user_id: number;
  parent_folder_id: number;
  name: string;
  description: string | null;
  created_at: Date;
};

export async function editFolder(
  editFolderData: EditFolderData,
  userData: UserJwtPayload
): Promise<FolderRow> {
  console.log(editFolderData, userData);

  const userID = userData.id;
  const folderID = editFolderData.id;
  const name = editFolderData.folderName;
  const description = editFolderData.description;

  const updateQuery =
    "UPDATE folders SET name = $1, description = $2 WHERE id = $3 AND user_id = $4 RETURNING *";

  try {
    const result = await pool.query(updateQuery, [
      name,
      description,
      folderID,
      userID,
    ]);

    // Check if any row was updated (folder exists and belongs to user)
    if (result.rows.length === 0) {
      throw new Error(
        "Folder not found or you don't have permission to edit it"
      );
    }

    return result.rows[0];
  } catch (err: any) {
    // Handle unique constraint violation (duplicate folder name in same parent)
    if (err.code === "23505") {
      throw new Error(
        "A folder with this name already exists in the parent folder"
      );
    }

    // Re-throw custom errors
    if (err.message.includes("Folder not found")) {
      throw err;
    }

    // Handle any other database errors
    console.error("Database error while editing folder:", err);
    throw new Error("Failed to update folder");
  }
}
