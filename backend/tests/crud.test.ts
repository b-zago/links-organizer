import request from "supertest";
import { app } from "./app.js";
import { pool } from "../src/db/db.js";
import { truncateAll, closeDb, registerAndLogin } from "./helpers.js";

let cookie: string;

beforeEach(async () => {
  await truncateAll();
  const auth = await registerAndLogin();
  cookie = auth.cookie;
});

afterAll(async () => {
  await closeDb();
});

describe("Folders — save and delete", () => {
  test("POST /add/folder saves a folder to the database", async () => {
    const res = await request(app)
      .post("/add/folder")
      .set("Cookie", cookie)
      .send({
        folderName: "My Folder",
        description: "a description",
        parentFolderID: 0,
      });

    expect(res.status).toBe(200);
    expect(res.body.name).toBe("My Folder");

    const dbRow = await pool.query("SELECT name FROM folders WHERE id = $1", [
      res.body.id,
    ]);
    expect(dbRow.rows).toHaveLength(1);
    expect(dbRow.rows[0].name).toBe("My Folder");
  });

  test("DELETE /delete/folder/:id removes the folder from the database", async () => {
    const createRes = await request(app)
      .post("/add/folder")
      .set("Cookie", cookie)
      .send({
        folderName: "To Delete",
        description: null,
        parentFolderID: 0,
      });

    const res = await request(app)
      .delete(`/delete/folder/${createRes.body.id}`)
      .set("Cookie", cookie);

    expect(res.status).toBe(200);

    const dbRow = await pool.query("SELECT id FROM folders WHERE id = $1", [
      createRes.body.id,
    ]);
    expect(dbRow.rows).toHaveLength(0);
  });
});

describe("Links — save and delete", () => {
  let folderId: number;

  beforeEach(async () => {
    const folderRes = await request(app)
      .post("/add/folder")
      .set("Cookie", cookie)
      .send({
        folderName: "Links Folder",
        description: null,
        parentFolderID: 0,
      });
    folderId = folderRes.body.id;
  });

  test("POST /add/link saves a link to the database", async () => {
    const res = await request(app)
      .post("/add/link")
      .set("Cookie", cookie)
      .send({
        url: "https://example.com/watch?v=abc",
        title: "Example video",
        description: null,
        parentFolderID: folderId,
      });

    expect(res.status).toBe(200);
    expect(res.body.url).toBe("https://example.com/watch?v=abc");

    const dbRow = await pool.query("SELECT url FROM links WHERE id = $1", [
      res.body.id,
    ]);
    expect(dbRow.rows).toHaveLength(1);
    expect(dbRow.rows[0].url).toBe("https://example.com/watch?v=abc");
  });

  test("DELETE /delete/link/:id removes the link from the database", async () => {
    const createRes = await request(app)
      .post("/add/link")
      .set("Cookie", cookie)
      .send({
        url: "https://example.com/todelete",
        title: "To Delete",
        description: null,
        parentFolderID: folderId,
      });

    const res = await request(app)
      .delete(`/delete/link/${createRes.body.id}`)
      .set("Cookie", cookie);

    expect(res.status).toBe(200);

    const dbRow = await pool.query("SELECT id FROM links WHERE id = $1", [
      createRes.body.id,
    ]);
    expect(dbRow.rows).toHaveLength(0);
  });
});
