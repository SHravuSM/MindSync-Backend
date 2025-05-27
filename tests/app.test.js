// const request = require("supertest");
// const app = require("../app");

// describe("GET /", () => {
//   it("should return JSON with message Hello", async () => {
//     const res = await request(app).get("/");
//     expect(res.statusCode).toBe(200);
//     expect(res.body).toEqual({ message: "Hello" });
//   });
// });

const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");

describe("GET /", () => {
  it("should return JSON with message Hello", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: "Hello" });
  });

  afterAll(async () => {
    // ✅ Close mongoose connection to avoid open handles
    await mongoose.connection.close();
  });
});
