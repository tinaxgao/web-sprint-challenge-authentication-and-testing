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
  const credentials = { username: "gabe", password: "password123" };

  describe("[POST] Register", () => {
    const endpoint = "/api/auth/register";

    it("can register a new user with username & password", async () => {
      const res = await request(server).post(endpoint).send(credentials);
      expect(res.status).toBe(201);
    });
    it("will not allow duplicate usernames", async () => {
      await request(server).post(endpoint).send(credentials);
      const res = await request(server).post(endpoint).send(credentials);
      expect(res.body.message).toBe("username taken");
    });
    it("error when missing username", async () => {
      const res = await request(server)
        .post(endpoint)
        .send(credentials.password);
      expect(res.body.message).toBe("username and password required");
      expect(res.body.status).toBe(400);
    });
    it("error when missing password", async () => {
      const res = await request(server)
        .post(endpoint)
        .send(credentials.username);
      expect(res.body.message).toBe("username and password required");
    });
  });

  describe("[POST] Login", () => {
    const endpoint = "/api/auth/login";

    beforeEach(async () => {
      await request(server).post("/api/auth/register").send(credentials);
    });

    it("can login with username & password", async () => {
      const res = await request(server).post(endpoint).send(credentials);
      expect(res.body.message).toBe(`welcome, ${credentials.username}`);
    });

    it("error when wrong credentials", async () => {
      const res = await request(server)
        .post(endpoint)
        .send({ username: "gabe", password: "badpassword" });
      expect(res.body.message).toBe(`invalid credentials`);
    });
  });
});

describe("Jokes router", () => {
  describe("[GET] Jokes", () => {
  const endpoint = "/api/jokes"
    
    it("cannot get jokes without token", async () => {
      const res = await request(server).get(endpoint);
      expect(res.status).toBe(401);
    });
    it("returns message if token is invalid", async () => {
      const res = await await request(server)
        .get(endpoint)
        .set("Authorization", "token");
      expect(res.message).toBe("token invalid");
    });
  });
});
