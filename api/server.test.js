const server = require("./server");
const request = require("supertest");
const db = require("../data/dbConfig");

test("sanity", () => {
  expect(true).not.toBe(false);
});

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

afterAll(async () => {
  await db.destroy();
});

it("is the correct env", () => {
  expect(process.env.NODE_ENV).toBe("testing");
});

describe("Auth router", () => {
  describe("[POST] Register", () => {
    it("can register a new user with username & password", async () => {
      const res = await request(server)
        .post("/api/auth/register")
        .send({ username: "gabe", password: "password123" });
      expect(res.status).toBe(201);
    });
    it("will not allow duplicate usernames", async () => {
      await request(server)
        .post("/api/auth/register")
        .send({ username: "gabe", password: "password123" });
      const res = await request(server)
        .post("/api/auth/register")
        .send({ username: "gabe", password: "password123" });
      expect(res.body.message).toBe("username taken");
    });
    it("error when missing username", async () => {
      const res = await request(server)
        .post("/api/auth/register")
        .send({ password: "password123" });
      expect(res.body.message).toBe("username and password required");
    });
    it("error when missing password", async () => {
      const res = await request(server)
        .post("/api/auth/register")
        .send({ username: "gabe" });
      expect(res.body.message).toBe("username and password required");
    });
  });

  describe("[POST] Login", () => {
    it.todo("can login with username & password");
    it.todo("error when missing username");
  });
});

describe("Jokes router", () => {
  describe("[GET] Jokes", () => {
    // let res;
    // beforeEach(async () => {
    //   res = await request(server).get("/api/jokes");
    // });
    it("cannot get jokes without token", async () => {
      const res = await request(server).get("/api/jokes");
      expect(res.status).toBe(401);
    });
    it("returns message if token is invalid", async () => {
      const res = await await request(server)
        .get("/api/jokes")
        .set("Authorization", "token");
      expect(res.message).toBe("token invalid");
    });
  });
});
