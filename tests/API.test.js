const request = require("supertest");
const application = require("../controller/server/api.server.controller");

// test for services fetching
describe("GET, DELETE /registered/services/:id", () => {
  test("test for fetching of a single service", async () => {
    const response = await request(application).get();
    expect(response.statusCode).toEqual(200);
    expect(response.headers["content-type"]).toEqual(
      expect.stringContaining("json")
    );
    expect(response.headers["content-type"]).toBeDefined();
  });

  test("test for deleting of a single service", async () => {
    const response = await request(application).delete();
    expect(response.statusCode).toEqual(200);
    expect(response.headers["content-type"]).toEqual(
      expect.stringContaining("json")
    );
    expect(response.headers["content-type"]).toBeDefined();
  });
});

// test for authentication routes
