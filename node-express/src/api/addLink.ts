import { pool } from "../db/db.js";
import type { UserJwtPayload } from "../types/express.js";

type LinkData = {
  url: string;
  title: string;
  description: string | null;
  parentFolderID: number;
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

export async function addLink(
  linkData: LinkData,
  userData: UserJwtPayload
): Promise<LinkRow> {
  console.log(linkData, userData);

  const userID = userData.id;
  const folderID = linkData.parentFolderID;
  const url = linkData.url;
  const title = linkData.title;
  const description = linkData.description;

  const insertQuery =
    "INSERT INTO links (user_id, folder_id, url, title, description) VALUES ($1, $2, $3, $4, $5) RETURNING *";

  try {
    const result = await pool.query(insertQuery, [
      userID,
      folderID,
      url,
      title,
      description,
    ]);
    return result.rows[0];
  } catch (err: any) {
    // Handle unique constraint violation (duplicate url in same folder)
    if (err.code === "23505") {
      throw new Error("This URL already exists in the folder");
    }

    // Handle foreign key violation (invalid folder_id or user_id)
    if (err.code === "23503") {
      throw new Error("Invalid folder or user reference");
    }

    // Handle any other database errors
    console.error("Database error while adding link:", err);
    throw new Error("Failed to create link");
  }
}
