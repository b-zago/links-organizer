import request from "supertest";
import { app } from "./app.js";
import { truncateAll, closeDb, defaultUser } from "./helpers.js";

beforeEach(async () => {
  await truncateAll();
});

afterAll(async () => {
  await closeDb();
});

describe("Auth", () => {
  test("POST /register creates a new user", async () => {
    const res = await request(app).post("/register").send(defaultUser);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("User registered!");
  });

  test("POST /login returns a token cookie for a registered user", async () => {
    await request(app).post("/register").send(defaultUser);

    const res = await request(app).post("/login").send({
      username: defaultUser.username,
      password: defaultUser.password,
    });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Logged in!");
    const cookies = res.headers["set-cookie"] as unknown as string[];
    expect(cookies[0]).toMatch(/^token=/);
  });
});
