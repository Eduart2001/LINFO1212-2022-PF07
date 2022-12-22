const sequelize = require("../Database/database");
const Movie = require("../Database/Movie");
const upload = require("./server_express").upload;
const fs = require("./server_express").fs;
const request = require("./server_express").request;

/**
 * Finds the movie according to given id.
 *
 * @param {number} movieId The id of the movie to find.
 * @return {Array} An array containing the information of the movie, empty array if movie is not found.
 */
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

/**
 * Gets all movies in the database.
 *
 * @return {Array} The array given by sequelize when all movies are requested.
 */
async function getAllMovies(){
    try {
        const [result, meta] = await sequelize.query("SELECT * from Movies");
        return result;
    } catch {
        return [];
    }
}

/**
 * Checks if the Movies table in the database is empty or not.
 * If it is, some movies are added (by calling addmoviesTest function) for testing purposes.
 * 
 * @return {String} "empty Movies table" if the table is empty, "Movie table is not empty" otherwise.
 */
async function emptyMoviesDB(){
    if ((await getAllMovies()).length == 0){
        console.log("empty Movies table");
        addMoviesTest();
        return "empty Movies table";
    } else{
        console.log("Movies table is not empty");
        return "Movies table is not empty";
    }
}

/**
 * Replaces invalid characters in a String to name a file.
 *
 * @param {String} movieName The name of a movie.
 * @return {String} newString is the movieName String without invalid characters.
 */
function replaceInvalid(movieName){
    var inv = ["/", ":", "*", "?", `"`, "<", ">", "|"];
    var newString = movieName;

    for (let i = 0; i < inv.length; i++){
        newString = newString.replaceAll(inv[i], "");
    }
    newString = newString.replaceAll(" ", "_");
    return newString;
}

/**
 * This function allows to download a picture from the internet and save it into our server.
 *
 * @param {String} uri is the "Uniform Resource Identifier", basically the link to the picture to download.
 * @param {String} filename the file will be named after this String.
 * @param {function} callback A function to be executed after this function's execution has finished.
 */
function download(uri, filename, callback){
    request.head(uri, function(err, res, body){
        console.log('content-type:', res.headers['content-type']);
        console.log('content-length:', res.headers['content-length']);

        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
}

/**
 * Updates the data for a movie in the database.
 *
 * @param {object} movie - An object containing the updated movie data.
 * @returns {Promise} - A promise that is resolved if the movie data is successfully updated, or rejected if there is an error.
 */
async function updateMovieData(movie){
    var [movieInDB,meta]=await sequelize.query(`SELECT * FROM Movies WHERE id =${movie.id}`);
    movieInDB=JSON.parse(JSON.stringify(movieInDB[0]))
    for (data of Object.keys(movie)) {
            s1= new String(movieInDB[data]);
            s2= new String(movie[data]);
            if(['id','ageRestriction','duration','IMDBscore'].includes(data)){
                try{
                    s1=Number(s1);
                    s2=Number(s2);
                    if(s1!==s2&&s2){
                        sequelize.query(
                            `UPDATE Movies 
                            SET ${data}='${s2}' 
                            WHERE id=${movie["id"]};`
                        )
                    }
                }catch{
                    continue;
                }
            }else{

             if(s1.localeCompare(s2)!==0){
                sequelize.query(
                    `UPDATE Movies 
                    SET ${data}='${s2}' 
                    WHERE id=${movie["id"]};`
                )
            }
        }
        
    }
}

/**
 * Removes the movie poster of a given movie from the file system.
 *
 * @param {number} id - The ID of the movie whose poster should be deleted.
 * @returns {Promise} - A promise that is resolved if the poster is successfully deleted, or rejected if there is an error.
 */
async function removeDeletedMoviePoster(id){
    const [result,meta]=await sequelize.query(`SELECT poster FROM Movies WHERE id=${id}`)
    console.log(result)
    const fileName = `static/Posters/`+result[0].poster;
    console.log(fileName)
    fs.unlink(fileName, (err) => {
        if (err) {
            console.error(err);
        } else {
            console.log(`Successfully deleted file: ${fileName}`);
        }
    });
}

/**
 * Deletes a movie from the database.
 *
 * @param {number} id - The ID of the movie to be deleted.
 * @returns {Promise} - A promise that is resolved if the movie is successfully deleted, or rejected if there is an error.
 */
async function deleteMovie(id){
    return await Movie.destroy({where:{id:id}});
}


/**
 * Adds some movies to the database for testing purposes.
 *
 * @return {String} "example movies added".
 */
function addMoviesTest(){
    //static data for testing purposes
    const movies = [];

    //black panther
    download('https://m.media-amazon.com/images/M/MV5BZGRmM2U1MzctZWU3Yi00NTYwLTg4OTMtNDk0YzZmYjBjNWU4XkEyXkFqcGdeQXVyMTUzOTcyODA5._V1_.jpg', 'static/Posters/Black_Panther_Wakanda_Forever.jpg', function(){console.log('Black_Panther_Wakanda_Forever.jpg downloaded');});
    movies.push({
        movieName: "Black Panther: Wakanda Forever",
        poster: "Black_Panther_Wakanda_Forever.jpg",
        description: "Queen Ramonda (Angela Bassett), Shuri (Letitia Wright), M’Baku (Winston Duke), Okoye (Danai Gurira) and the Dora Milaje (including Florence Kasumba), fight to protect their nation from intervening world powers in the wake of King T’Challa’s death. As the Wakandans strive to embrace their next chapter, the heroes must band together with the help of War Dog Nakia (Lupita Nyong’o) and Everett Ross (Martin Freeman) and forge a new path for the kingdom of Wakanda.",
        actors: "Letitia Wright, Lupita Nyong'o, Danai Gurira, Winston Duke, Angela Bassett, Florence Kasumba, Tenoch Huerta",
        directors:"Ryan Coogler",
        releaseDate: new Date("2022-11-11"),
        trailerURL: "https://www.youtube.com/watch?v=_Z3QKkl1WyM",
        country: "United States of America",
        ageRestriction: 12,
        IMDBscore: "7.3",
        genre: "Action, Adventure",
        duration: 161
    });

    //black adam
    download('https://m.media-amazon.com/images/M/MV5BYzZkOGUwMzMtMTgyNS00YjFlLTg5NzYtZTE3Y2E5YTA5NWIyXkEyXkFqcGdeQXVyMjkwOTAyMDU@._V1_.jpg', 'static/Posters/Black_Adam.jpg', function(){console.log('Black_Adam.jpg downloaded');});
    movies.push({
        movieName: "Black Adam",
        poster: "Black_Adam.jpg",
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

    //avatar
    download('https://m.media-amazon.com/images/M/MV5BYjhiNjBlODctY2ZiOC00YjVlLWFlNzAtNTVhNzM1YjI1NzMxXkEyXkFqcGdeQXVyMjQxNTE1MDA@._V1_.jpg', 'static/Posters/Avatar_The_Way_of_Water.jpg', function(){console.log('Avatar_The_Way_of_Water.jpg downloaded');});
    movies.push({
        movieName: "Avatar: The Way of Water",
        poster: "Avatar_The_Way_of_Water.jpg",
        description: "Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri and the army of the Na'vi race to protect their home.",
        actors: "Sam Worthington, Zoe Saldana, Sigourney Weaver, Stephen Lang, Kate Winslet, Cliff Curtis",
        directors:"James Cameron",
        releaseDate: new Date("2022-12-16"),
        trailerURL: "https://www.youtube.com/watch?v=d9MyW72ELq0",
        country: "United States of America",
        ageRestriction: 12,
        IMDBscore: "N/A",
        genre: "Action, Adventure",
        duration: 192
    });

    //spiderman
    download('https://m.media-amazon.com/images/M/MV5BZWMyYzFjYTYtNTRjYi00OGExLWE2YzgtOGRmYjAxZTU3NzBiXkEyXkFqcGdeQXVyMzQ0MzA0NTM@._V1_.jpg', 'static/Posters/Spider-Man_No_Way_Home.jpg', function(){console.log('Spider-Man_No_Way_Home.jpg downloaded');});
    movies.push({
        movieName: "Spider-Man: No Way Home",
        poster: "Spider-Man_No_Way_Home.jpg",
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
    getMovieById: getMovieById,
    getAllMovies: getAllMovies,
    addMoviesTest: addMoviesTest,
    emptyMoviesDB: emptyMoviesDB,
    replaceInvalid: replaceInvalid,
    downlaod: download,
    updateMovieData: updateMovieData,
    removeDeletedMoviePoster:removeDeletedMoviePoster,
    deleteMovie:deleteMovie,
}