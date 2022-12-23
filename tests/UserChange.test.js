const app = require('../server/server_express').app;
const crypto = require('crypto');
const sequelize = require('../server/server_express').sequelize;

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

  test('should hash old password and compare to real password', async () => {
    const hashedOldPassword = crypto.createHash("md5").update(oldPassword).digest('hex');
    const result = await sequelize.query(`Select password From Users where email = 'adhamez10@gmail.com'`);
    const realPass = result[0].password;
    expect(hashedOldPassword).toEqual(realPass);
  });

  test('should not allow old password and new password to be the same', async () => {
    oldPassword = 'adham';
    newPassword = 'adham';
    passRep = 'adham';
    const response = await request(app)
      .post('/password_change')
      .send({ oldPassword, newPassword, passRep });
    expect(response.redirects[0]).toInclude('alert=Can%27t%20have%20the%20same%20password%20as%20the%20old%20password');
  });

  test('should not allow new password and password rep to be different', async () => {
    newPassword = 'adham1';
    passRep = 'adham2';
    const response = await request(app)
      .post('/password_change')
      .send({ oldPassword, newPassword, passRep });
    expect(response.redirects[0]).toInclude('alert=Retype%20password');
  });

  test('should update password in database and session when new password is valid', async () => {
    await request(app)
      .post('/password_change')
      .send({ oldPassword, newPassword, passRep });
    const result = await sequelize.query(`Select password From Users where email = 'adhamez10@gmail.com'`);
    const realPass = result[0].password;
    expect(realPass).toEqual(newPassword);
    expect(req.session.password).toEqual(newPassword);
  });
});
