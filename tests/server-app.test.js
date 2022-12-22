const request = require("supertest");
const app = require("../server/server_express");
const server = require("../server/server_express").server;

beforeAll(() => {
  server.close();
});
afterAll(() => {
  server.close();
});
describe("Testing login requests", () => {
    it("GET /login", async () => {
        const httpRequest = request(app).get('/login');
        const response = await httpRequest.expect(200);
        expect(response.status).toBe(200);
    });
    it("GET /login incorrect", async () => {
        const httpRequest = request(app).get('/login?incorrect=true');
        const response = await httpRequest.expect(200);
        expect(response.status).toBe(200);
    })
});