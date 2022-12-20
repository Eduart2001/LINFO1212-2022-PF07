const movie = require("../server/movie");

beforeAll( async () => {
    await movie.emptyMoviesDB();
});

describe("getMovieById function tests", () => {
    test("Existing movie id", async () => {
        let result = await movie.getMovieById(0);
        expect(result).toBeDefined();
    });
});