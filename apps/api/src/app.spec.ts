import request from "supertest";

import app from "./app";

jest.mock("jsonwebtoken", () => ({
  verify: jest.fn((token, secretKey, callback) => {
    return callback(null, {});
  }),
}));

describe("app.ts", () => {
  describe("/api/auth", () => {
    test("it should register a user", (done) => {
      request(app)
        .post("/api/auth/register")
        .send({ username: "mfee-test", password: "Aa$123" })
        .then((res) => {
          expect(res.statusCode).toBe(201);
          expect(res.body.msg).toEqual("User registered successfully");
          
          done();
        });
    });

    test("it should get all categories", (done) => {
      request(app)
        .get("/api/categories")
        .set("authorization", "Bearer 12345")
        .then((res) => {
          expect(res.statusCode).toBe(200);
          expect(res.body).toEqual([]);

          done();
        });
    });
  });
});
