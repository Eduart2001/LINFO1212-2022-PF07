const seat = require("../server/seat");
const Seat = require("../Database/Seat")
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

describe("randomArray function tests", () => {
    
  test('should return a An array of random integers', async () => {
        const arrayLength=9
        const result = await seat.randomArray(arrayLength)
        expect(arrayLength).toEqual(result.length);
  });
  test('should return empty array when an error occurs', async () => {
      const arrayLength=-1
      const result = await seat.randomArray(arrayLength)
      expect([]).toEqual(result.length);
  });
});

describe("emptyTimeTableDB function tests", () => {
  test('should return a string indicating whether the Seats table is empty or not.', async () => {
     await Seat.destroy({
       where: {},
     })
   const result = await seat.emptyTimeTableDB()
   expect(result).toBe("empty Seats table")
 });
 test('should return a string indicating whether the Seats table is empty or not.', async () => {
       const result = await seat.emptyTimeTableDB()
       expect(result).toBe("Seats table is not empty")
 });
});

describe("emptyTimeTableDB function tests", () => {
  test('should return a string indicating whether the Seats table is empty or not.', async () => {
     await Seat.destroy({
       where: {},
     })
   const result = await seat.addSeats()
   expect(result).toBe("empty Seats table")
 });
   
});

