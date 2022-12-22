const login = require("../server/login");
var crypto = require("crypto");
const server = require("../server/server_express").server;

afterAll(() => {
  server.close();
});
beforeAll( async () => {
    await login.emptyUsersDB();
    server.close();
});

describe("Login function tests", () => {
    test("Not matching password", async () => {
        let result = await login.login("isaimola@gmail.com", "fdosfodis");
        expect(result).toBe("Password does not match, try again");
    });
    test("Correct password", async () => {
        let result = await login.login("isaimola@gmail.com", crypto.createHash("md5").update("isai").digest('hex'));
        expect(result).toBe("isaimola@gmail.com");
    });
    test("Not registered email", async () => {
        let result = await login.login("some@some.com", "safds");
        expect(result).toBe("User name does not exist, try again");
    });
});

describe("getName function tests", () => {
    test("Getting a name from existing account", async () => {
        let result = await login.getName("abdullahu.eduart@gmail.com");
        expect(result).toBe("Eduart Abdullahu");
    });
    test("Getting a name from not registered account", async () => {
        let result = await login.getName("some@some.com");
        expect(result).toBe("User name does not exist, try again");
    });
});

describe("isAdmin function tests", () => {
    test("Checking for an admin account", async () => {
        let result = await login.isAdmin("admin@admin.com");
        expect(result).toBeTruthy();
    });
    test("Checking for a normal account", async () => {
        let result = await login.isAdmin("adhamez10@gmail.com");
        expect(result).toBeFalsy();
    });
    test("Checking for a not registered account", async () => {
        let result = await login.isAdmin("some@some.com");
        expect(result).toBeFalsy();
    });
});

describe("emailTaken function tests", () => {
    test("Email given is already being used", async () => {
        let result = await login.emailTaken("admin@admin.com");
        expect(result).toBeTruthy();
    });
    test("Email given is not registered yet", async () => {
        let result = await login.isAdmin("test@test.com");
        expect(result).toBeFalsy();
    });
});

describe("getAllUsers function tests", () => {
    test("Getting the array of users", async () => {
        let result = await login.getAllUsers();
        expect(result.length).toBeGreaterThan(0);
    });
});

describe("emptyUsersDB function tests", () => {
    test("Users table is not empty in database", async () => {
        let result = await login.emptyUsersDB();
        expect(result).toBe("Users table is not empty");
    });
});