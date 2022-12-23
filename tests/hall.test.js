hall =require("../server/Hall")


const sequelize = require("../Database/database");
const server = require("../server/server_express").server;

beforeAll(() => {
  server.close();
});
afterAll(() => {
  server.close();
});


describe("getAllHalls function tests", () => {
    test('should return a the number of halls', async () => {
           const id = 3;
           const result = await hall.getAllHalls()

           expect(result.length).toEqual(3);
    });
});


describe("create3Halls function tests", () => {
    
    test('should return a the number of halls', async () => {
           const result = await hall.create3Halls()

           expect(result).toBe("not ok");
    });
});

describe("getHallCapacity function tests", () => {
    
    test('should return a the capacity of given hall', async () => {
           const expectedResult=50;
           const result = await hall.getHallCapacity(1)

           expect(expectedResult).toEqual(result[0].capacity);
    });
    test('should return empty array when an error occurs', async () => {
        const result = await hall.getHallCapacity(-1)
        expect([]).toEqual(result);
    });
});