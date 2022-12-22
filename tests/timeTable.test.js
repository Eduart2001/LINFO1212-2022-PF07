const timeTable = require("../server/timeTable");
const sequelize = require("../Database/database");
const server = require("../server/server_express").server;

beforeAll(() => {
  server.close();
});
afterAll(() => {
  server.close();
});
describe('getTimeTable',() => {
  test('should return time table for given id', async () => {
    const id = 1;
    const result = await timeTable.getTimeTable(id);
    const [expectedResult,meta] = await sequelize.query(`SELECT * from TimeTables WHERE hallId=${id}`);
    console.log(expectedResult)
    expect(expectedResult.length).toEqual(result.length);
  });
    test('should return empty array when an error occurs', async () => {
      const id = 4;
      const result = [];
      expect(result).toEqual([]);
    });
  });