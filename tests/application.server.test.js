import { it, expect, describe, test } from "vitest";
const application = require("../controller/server/api.server.controller");
const request = require("supertest");

describe("test for root route for the api", () => {
  test("sample", async () => {
    const response = await request(application).get("/");

    // test conditions
    expect(response.statusCode).toStrictEqual(Number.parseInt(200));
    expect(response).toBeDefined();
    expect(response.headers["content-type"]).toStrictEqual(
      expect.stringContaining("json")
    );
    expect(response).not.toBeUndefined();
  });
});

// tests for api services authentications
// fetch single service from api db
describe("/api/registered/services/:id GET", () => {
  test("test for api route to fetch single service", async () => {
    const response = await request(application).get(
      "/api/registered/services/1245a2b6-1415-4ae1-9d93-1aa1ba934364"
    );

    // test conditions
    expect(response.headers["content-type"]).toStrictEqual(
      expect.stringContaining("json")
    );
    expect(response.statusCode).toEqual(Number(200));
    expect(response).not.toBeNull();
    expect(response).not.toBeUndefined();
    expect(response).toBeTypeOf("object");
  });
});

// delete single service from api db
describe("/api/registered/services/:id DELETE", () => {
  test("test for api route to fetch single service", async () => {
    const response = await request(application).delete(
      "/api/registered/services/1245a2b6-1415-4ae1-9d93-1aa1ba934364"
    );

    // test conditions
    expect(response.headers["content-type"]).toStrictEqual(
      expect.stringContaining("json")
    );
    expect(response.statusCode).toEqual(Number(200));
    expect(response).not.toBeNull();
    expect(response).not.toBeUndefined();
    expect(response).toBeTypeOf("object");
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

    // test conditions
    expect(response.headers["content-type"]).toStrictEqual(
      expect.stringContaining("json")
    );
    expect(response.statusCode).toEqual(Number(200));
    expect(response).not.toBeNull();
    expect(response).not.toBeUndefined();
    expect(response).toBeTypeOf("object");
  });
});

// tests for user accounts authentication
// user account sign up
describe("/user/account/signup POST", () => {
  test("test for checking user account signup", async () => {
    const response = await request(application)
      .post("/user/account/signup")
      .send({
        username: "sample username",
        email: "sample@gmail.com",
        password: "ABCabc123!",
        service_id: "1245a2b6-1415-4ae1-9d93-1aa1ba934364",
      });

    // test conditions
    expect(response.statusCode).toStrictEqual(Number.parseInt(201));
    expect(response.headers["content-type"]).toBe(
      expect.stringContaining("json")
    );
    expect(response.body).toBeDefined();
    expect(response.body).not.toBeUndefined();
    expect(response.body).not.toBeNull();
    expect(response.body).toBeTypeOf("object");
  });
});

// user account login
describe("/user/account/login POST", () => {
  test("test for checking user account login", async () => {
    const response = await request(application)
      .post("/user/account/login")
      .send({
        email: "sample@gmail.com",
        password: "ABCabc123!",
      });

    // test conditions
    expect(response.statusCode).toStrictEqual(Number.parseInt(200));
    expect(response.headers["content-type"]).toBe(
      expect.stringContaining("json")
    );
    expect(response.body).toBeDefined();
    expect(response.body).not.toBeNull();
    expect(response.body).not.toBeUndefined();
    expect(response.body).toBeTypeOf("object");
  });
});
