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




const Preferences = require("../Database/Preferences");

describe('/preferences route', () => {
  it('should update or create a preferences record in the database', async () => {
    const res = request(app)
      .post('/preferences')
      .send({ showAll: true, darkMode: false });

    const preferences = await Preferences.findOne({ where: { email: 'admin@admin.com' } });
    expect(preferences.showAll).toBe("null");
    expect(preferences.darkMode).toBe("on");
  });
});