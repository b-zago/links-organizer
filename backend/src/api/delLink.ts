import { pool } from "../db/db.js";
import type { UserJwtPayload } from "../types/express.js";

export async function delLink(
  linkID: number,
  userData: UserJwtPayload
): Promise<void> {
  console.log("Deleting link:", linkID, userData);

  const userID = userData.id;

  const deleteQuery = "DELETE FROM links WHERE id = $1 AND user_id = $2";

  try {
    const result = await pool.query(deleteQuery, [linkID, userID]);

    // Check if any row was deleted (link exists and belongs to user)
    if (result.rowCount === 0) {
      throw new Error(
        "Link not found or you don't have permission to delete it"
      );
    }

    console.log(`Link ${linkID} deleted successfully`);
  } catch (err: any) {
    // Re-throw custom errors
    if (err.message.includes("Link not found")) {
      throw err;
    }

    // Handle any other database errors
    console.error("Database error while deleting link:", err);
    throw new Error("Failed to delete link");
  }
}
