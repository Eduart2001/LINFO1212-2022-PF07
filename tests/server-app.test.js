const request = require("supertest");
const app = require("../server/server_express");
const crypto = require('crypto');
const sequelize = require("../Database/database");
const server = require("../server/server_express").server;
const Preferences = require("../Database/Preferences");


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
    });
});

describe('password change', () => {
  let oldPassword;
  let newPassword;
  let passRep;

  beforeEach(() => {
    oldPassword = 'adham';
    newPassword = 'adham1';
    passRep = 'adham1';
  });

  afterEach(() => {
    oldPassword = null;
    newPassword = null;
    passRep = null;
  });

  it("POST /should not allow old password and new password to be the same", async () => {
    oldPassword = 'adham';
    newPassword = 'adham';
    passRep = 'adham';
    const httpRequest = request(app).post("/password_change").send({ oldPassword, newPassword, passRep });
    const response = await httpRequest.expect(200);
    expect(response.redirects[0]).toInclude('alert=Can%27t%20have%20the%20same%20password%20as%20the%20old%20password');
  });

  it("POST /should not allow new password and password rep to be different", async () => {
    newPassword = 'adham1';
    passRep = 'adham2';
    const httpRequest = request(app).post("/password_change").send({ oldPassword, newPassword, passRep });
    const response = await httpRequest.expect(200);
    expect(response.redirects[0]).toInclude('alert=Retype%20password');
  });

  it("POST /should update password in database and session when new password is valid", async () => {
    const httpRequest = request(app).post("/password_change").send({ oldPassword, newPassword, passRep });
    const response = await httpRequest.expect(200);
    const result = await sequelize.query(`Select password From Users where email = 'adhamez10@gmail.com'`);
    const realPass = result[0].password;
    expect(realPass).toEqual(newPassword);
    expect(req.session.password).toEqual(newPassword);
  });
});

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