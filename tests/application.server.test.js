import { it, expect, describe, test } from "vitest";
const application = require("../controller/server/api.server.controller");
const request = require("supertest");

describe("test for root route for the api", () => {
  test("sample", async () => {
    const response = await request(application).get("/");
    expect(response.statusCode).toStrictEqual(Number.parseInt(200));
    expect(response).toBeDefined();
    expect(response).not.toBeUndefined();
  });
});

// tests for api service login
describe("/api/service/login POST", () => {
  test("test for api service login", async () => {
    const response = await request(application)
      .post("/api/service/login")
      .send({
        service_password: "ABCDEFGHIJKLMNOPQRSTUVWXYZabc",
        service: "sample", 
      });

      expect(response.headers).toStrictEqual(expect.stringContaining("json"));
      expect(response.statusCode).toEqual(Number(200));
      expect(response).not.toBeNull();
      expect(response).not.toBeUndefined();
      expect(response).toBeTypeOf("object"); 
  });
});
