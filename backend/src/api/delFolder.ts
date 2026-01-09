import { pool } from "../db/db.js";
import type { UserJwtPayload } from "../types/express.js";

export async function delFolder(
  folderID: number,
  userData: UserJwtPayload
): Promise<void> {
  console.log("Deleting folder:", folderID, userData);

  const userID = userData.id;

  const deleteQuery = "DELETE FROM folders WHERE id = $1 AND user_id = $2";

  try {
    const result = await pool.query(deleteQuery, [folderID, userID]);

    // Check if any row was deleted (folder exists and belongs to user)
    if (result.rowCount === 0) {
      throw new Error(
        "Folder not found or you don't have permission to delete it"
      );
    }

    console.log(`Folder ${folderID} deleted successfully`);
  } catch (err: any) {
    // Handle foreign key violation (folder has child folders or links)
    if (err.code === "23503") {
      throw new Error(
        "Cannot delete folder because it contains subfolders or links"
      );
    }

    // Re-throw custom errors
    if (err.message.includes("Folder not found")) {
      throw err;
    }

    // Handle any other database errors
    console.error("Database error while deleting folder:", err);
    throw new Error("Failed to delete folder");
  }
}
