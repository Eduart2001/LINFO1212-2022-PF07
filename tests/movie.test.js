const movie = require("../server/movie");
const fs = require("fs");
const Movie = require("../Database/Movie");
const server = require("../server/server_express").server;

beforeAll( async () => {
    await movie.emptyMoviesDB();
    server.close();
});

afterAll(() => {
    fs.unlink("./example.jpg", function (err){
        if (err) throw err;
    });
    server.close();
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

describe("getMovieName function tests", () => {
    test("Existing movie", async () => {
        let result = await movie.getMovieName(5);
        expect(result.movieName).toBe("Puss in Boots: The Last Wish");
    });
    test("Not existing movie", async () => {
        let result = await movie.getMovieName(0);
        expect(result).toBeUndefined();
    });
});

describe("getAllGenres function tests", () => {
    test("Genre array", async () => {
        let result = await movie.getAllGenres();
        expect(result.length).toBeGreaterThan(0);
    });
    test("Similar to Ac", async () => {
        let result = await movie.getAllGenres("Ac");
        expect(result.length).toBeGreaterThan(0);
    });
});

describe("getAllMovies function tests", () => {
    test("Getting the array of movies", async () => {
        let result = await movie.getAllMovies();
        expect(result.length).toBeGreaterThan(0);
    });
});

describe("getAllAvailableMovies function tests", () => {
    test("Getting available movies", async () => {
        let result = await movie.getAllAvailableMovies();
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
});


describe("addMoviesTest function tests", () => {
    test("add to db characters", async () => {
        const movies= await movie.getAllMovies();

        for(obj of movies){
            await movie.removeDeletedMoviePoster(obj.id)
        }
        Movie.destroy({
            where:{},
        })
        let result = await ovie.addMoviesTest()
        expect(result).toBe("example movies added");
    });
});
