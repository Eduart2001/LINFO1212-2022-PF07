const movie = require("../server/movie");
const fs = require("../server/server_express").fs;

beforeAll( async () => {
    await movie.emptyMoviesDB();
});

afterAll(() => {
    fs.unlink("./example.jpg", function (err){
        if (err) throw err;
    });
});

describe("getMovieById function tests", () => {
    test("Existing movie id", async () => {
        let result = await movie.getMovieById(1);
        expect(result.length).toBeGreaterThan(0);
    });
    test("Not existing movie id", async () => {
        let result = await movie.getMovieById(0);
        expect(result.length).toBe(0);
    });
});

describe("getAllMovies function tests", () => {
    test("Getting the array of movies", async () => {
        let result = await movie.getAllMovies();
        expect(result.length).toBeGreaterThan(0);
    });
});

describe("emptyMoviesDB function tests", () => {
    test("Movies table is not empty in database", async () => {
        let result = await movie.emptyMoviesDB();
        expect(result).toBe("Movies table is not empty");
    });
});

describe("replaceInvalid function tests", () => {
    test("Replace invalid characters", () => {
        let result = movie.replaceInvalid("Black <Panther: *Wakanda Forever?");
        expect(result).toBe("Black_Panther_Wakanda_Forever");
    });
    test("There are not invalid characters", () => {
        let result = movie.replaceInvalid("This_is_ok");
        expect(result).toBe("This_is_ok");
    });
});

describe("download function tests", () => {
    test("Download valid picture", () => {
        let result = movie.downlaod("https://t3.ftcdn.net/jpg/00/92/53/56/360_F_92535664_IvFsQeHjBzfE6sD4VHdO8u5OHUSc6yHF.jpg", "./example.jpg", function(){console.log('example.jpg downloaded');});
        fs.readFile("./example.jpg", function (err, data){
            expect(data).toBeDefined();
        });
    });
    test("Download from invalid link", () => {
        let result = movie.downlaod("na", "./example.jpg", function(){console.log('example.jpg downloaded');});
        expect(result).toThrow();
    });
});