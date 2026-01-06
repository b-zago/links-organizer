import { pool } from "../db/db.js";
import type { UserJwtPayload } from "../types/express.js";

type EditLinkData = {
  url: string;
  title: string;
  description: string | null;
  id: number;
};

type LinkRow = {
  id: number;
  user_id: number;
  folder_id: number;
  url: string;
  title: string;
  description: string | null;
  icon_id: number;
};

export async function editLink(
  editLinkData: EditLinkData,
  userData: UserJwtPayload
): Promise<LinkRow> {
  console.log(editLinkData, userData);

  const userID = userData.id;
  const linkID = editLinkData.id;
  const url = editLinkData.url;
  const title = editLinkData.title;
  const description = editLinkData.description;

  const updateQuery =
    "UPDATE links SET url = $1, title = $2, description = $3 WHERE id = $4 AND user_id = $5 RETURNING *";

  try {
    const result = await pool.query(updateQuery, [
      url,
      title,
      description,
      linkID,
      userID,
    ]);

    // Check if any row was updated (link exists and belongs to user)
    if (result.rows.length === 0) {
      throw new Error("Link not found or you don't have permission to edit it");
    }

    return result.rows[0];
  } catch (err: any) {
    // Handle unique constraint violation (duplicate url in same folder)
    if (err.code === "23505") {
      throw new Error("This URL already exists in the folder");
    }

    // Re-throw custom errors
    if (err.message.includes("Link not found")) {
      throw err;
    }

    // Handle any other database errors
    console.error("Database error while editing link:", err);
    throw new Error("Failed to update link");
  }
}
