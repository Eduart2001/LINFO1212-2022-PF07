const sequelize = require("./server_express").sequelize;
const Movie = require("./server_express").Movie;
const upload = require("./server_express").upload;
const fs = require("./server_express").fs;
const request = require("./server_express").request;

async function getMovieById(movieId){
    try {
        if (movieId==undefined || movieId==="") return [];
        const result = await sequelize.query(`Select * From Movies where id = '${movieId}'`);
        if (!result[0].length > 0) return [];
        return result[0];
    } catch (e){
        throw e;
    }
}

async function getAllMovies(){
    try {
        const [result, meta] = await sequelize.query("SELECT * from Movies");
        return result;
    } catch {
        return [];
    }
}

async function emptyMoviesDB(){
    if ((await getAllMovies()).length == 0){
        console.log("empty Movies table");
        addMoviesTest();
        return "ok";
    } else{
        console.log("Movies table is not empty");
        return "not ok";
    }
}

function replaceInvalid(movieName){
    var inv = ["/", ":", "*", "?", `"`, "<", ">", "|"];
    var newString = movieName;

    for (let i = 0; i < inv.length; i++){
        newString = newString.replaceAll(inv[i], "");
    }
    return newString;
}

function download(uri, filename, callback){
    request.head(uri, function(err, res, body){
        console.log('content-type:', res.headers['content-type']);
        console.log('content-length:', res.headers['content-length']);

        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
}

function addMoviesTest(){
    //static data for testing purposes
    const movies = [];

    download('https://m.media-amazon.com/images/M/MV5BZGRmM2U1MzctZWU3Yi00NTYwLTg4OTMtNDk0YzZmYjBjNWU4XkEyXkFqcGdeQXVyMTUzOTcyODA5._V1_.jpg', 'static/Posters/Black Panther Wakanda Forever.jpg', function(){console.log('Black Panther Wakanda Forever.jpg downloaded');});

    movies.push({
        movieName: "Black Panther: Wakanda Forever",
        poster: "Black Panther Wakanda Forever.jpg",
        description: "Queen Ramonda (Angela Bassett), Shuri (Letitia Wright), M’Baku (Winston Duke), Okoye (Danai Gurira) and the Dora Milaje (including Florence Kasumba), fight to protect their nation from intervening world powers in the wake of King T’Challa’s death. As the Wakandans strive to embrace their next chapter, the heroes must band together with the help of War Dog Nakia (Lupita Nyong’o) and Everett Ross (Martin Freeman) and forge a new path for the kingdom of Wakanda.",
        actors: "Letitia Wright, Lupita Nyong'o, Danai Gurira, Winston Duke, Angela Bassett, Florence Kasumba, Tenoch Huerta",
        directors:"Ryan Coogler",
        releaseDate: new Date("2022-11-11"),
        trailerURL: "https://www.youtube.com/watch?v=_Z3QKkl1WyM&t=2s",
        country: "United States of America",
        ageRestriction: 12,
        IMDBscore: "7.3",
        genre: "Action, Adventure",
        duration: 161
    });

    download('https://m.media-amazon.com/images/M/MV5BYzZkOGUwMzMtMTgyNS00YjFlLTg5NzYtZTE3Y2E5YTA5NWIyXkEyXkFqcGdeQXVyMjkwOTAyMDU@._V1_.jpg', 'static/Posters/Black Adam.jpg', function(){console.log('Black Adam.jpg downloaded');});

    movies.push({
        movieName: "Black Adam",
        poster: "Black Adam.jpg",
        description: "Nearly 5,000 years after he was bestowed with the almighty powers of the Egyptian gods--and imprisoned just as quickly--Black Adam is freed from his earthly tomb, ready to unleash his unique form of justice on the modern world.",
        actors: "Dwayne Johnson, Aldis Hodge, Pierce Brosnan, Noah Centineo, Sarah Shahi, Quintessa Swindell, Marwan Kenzari",
        directors:"Jaume Collet-Serra",
        releaseDate: new Date("2022-10-21"),
        trailerURL: "https://www.youtube.com/watch?v=X0tOpBuYasI",
        country: "United States of America",
        ageRestriction: 12,
        IMDBscore: "6.6",
        genre: "Action, Science Fiction",
        duration: 125
    });

    download('https://m.media-amazon.com/images/M/MV5BYjhiNjBlODctY2ZiOC00YjVlLWFlNzAtNTVhNzM1YjI1NzMxXkEyXkFqcGdeQXVyMjQxNTE1MDA@._V1_.jpg', 'static/Posters/Avatar The Way of Water.jpg', function(){console.log('Avatar The Way of Water.jpg downloaded');});

    movies.push({
        movieName: "Avatar: The Way of Water",
        poster: "Avatar The Way of Water.jpg",
        description: "Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri and the army of the Na'vi race to protect their home.",
        actors: "Sam Worthington, Zoe Saldana, Sigourney Weaver, Stephen Lang, Kate Winslet, Cliff Curtis",
        directors:"Jaume Collet-Serra",
        releaseDate: new Date("2022-12-16"),
        trailerURL: "https://www.youtube.com/watch?v=d9MyW72ELq0",
        country: "United States of America",
        ageRestriction: 12,
        IMDBscore: "N/A",
        genre: "Action, Adventure",
        duration: 192
    });

    //spiderman
    download('https://m.media-amazon.com/images/M/MV5BZWMyYzFjYTYtNTRjYi00OGExLWE2YzgtOGRmYjAxZTU3NzBiXkEyXkFqcGdeQXVyMzQ0MzA0NTM@._V1_.jpg', 'static/Posters/Spider-Man No Way Home.jpg', function(){console.log('Spider-Man No Way Home.jpg downloaded');});

    movies.push({
        movieName: "Spider-Man: No Way Home",
        poster: "Spider-Man No Way Home.jpg",
        description: "With Spider-Man's identity now revealed, Peter asks Doctor Strange for help. When a spell goes wrong, dangerous foes from other worlds start to appear, forcing Peter to discover what it truly means to be Spider-Man.",
        actors: "Tom Holland, Zendaya, Benedict Cumberbatch, Jacob Batalon, Jon Favreau, Jamie Foxx, Willem Dafoe, Alfred Molina, Benedict Wong, Marisa Tomei, Andrew Garfield, Tobey Maguire",
        directors:"Jon Watts",
        releaseDate: new Date("2021-12-17"),
        trailerURL: "https://www.youtube.com/watch?v=JfVOs4VSpmA",
        country: "United States of America",
        ageRestriction: 12,
        IMDBscore: "8.3",
        genre: "Action, Adventure",
        duration: 148
    });

    for (let i = 0; i < movies.length; i++) {
        Movie.create(movies[i]);
    }

    return "example movies added";
}

module.exports={
    getMovieById : getMovieById,
    getAllMovies: getAllMovies,
    addMoviesTest: addMoviesTest,
    emptyMoviesDB: emptyMoviesDB,
    replaceInvalid: replaceInvalid
}