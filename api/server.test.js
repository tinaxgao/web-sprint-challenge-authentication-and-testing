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
    it.todo("can register a new user with username & password");
    it.todo("error when missing username");
    it.todo("error when missing password");
  });

  describe("[POST] Login", () => {
    it.todo("can login with username & password");
    it.todo("error when missing username");
  });
});

describe("Jokes router", () => {
  describe("[GET] Jokes", () => {
    it.todo("cannot get jokes without token");
    it.todo("can get jokes with token");
  });
});
