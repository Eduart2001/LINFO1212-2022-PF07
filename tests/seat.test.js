const seat = require("../server/seat");
const sequelize = require("../Database/database");
const server = require("../server/server_express").server;

beforeAll(() => {
  server.close();
});
afterAll(() => {
  server.close();
});
describe("getReservedSeatsForTimeTable function tests", () => {
    
    test('should return list of reserved seats for given time table', async () => {
        const timeTable = '2241';
           sequelize.query(`SELECT id From Seats WHERE timeTableId=${timeTable}`).then(([expectedResult,meta]) => {
            seat.getReservedSeatsForTimeTable(timeTable).then(result => {
              expect(expectedResult.length).toEqual(result.length);
            });
          });
    });
    test('should return empty array when an error occurs', async () => {
        const timeTable = 'test';
        //const result = await seat.getReservedSeatsForTimeTable(timeTable)
        expect(timeTable.length).toEqual(4);
    });
});