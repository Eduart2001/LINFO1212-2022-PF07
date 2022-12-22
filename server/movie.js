const sequelize = require("../Database/database");
const Movie = require("../Database/Movie");
const fs = require("fs")
var request = require("request");

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
    var inv = ["/", ":", "*", "?", `"`, "<", ">", "|", "."];
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

    //Puss in Boots
    download('https://m.media-amazon.com/images/M/MV5BNjMyMDBjMGUtNDUzZi00N2MwLTg1MjItZTk2MDE1OTZmNTYxXkEyXkFqcGdeQXVyMTQ5NjA0NDM0._V1_.jpg', 'static/Posters/Puss_in_Boots_The_Last_Wish.jpg', function(){console.log('Puss_in_Boots_The_Last_Wish.jpg downloaded');});
    movies.push({
        movieName: "Puss in Boots: The Last Wish",
        poster: "Puss_in_Boots_The_Last_Wish.jpg",
        description: "Puss in Boots discovers that his passion for adventure has taken its toll: he has burned through eight of his nine lives. Puss sets out on an epic journey to find the mythical Last Wish and restore his nine lives.",
        actors: "Antonio Banderas, Salma Hayek, Harvey Guillén, Florence Pugh, John Mulaney, Wagner Moura",
        directors:"Joel Crawford",
        releaseDate: new Date("2022-12-21"),
        trailerURL: "https://www.youtube.com/watch?v=xgZLXyqbYOc",
        country: "United States of America",
        ageRestriction: 6,
        IMDBscore: "7.6",
        genre: "Animation, Family/Kids",
        duration: 101
    });

    //The menu
    download('https://m.media-amazon.com/images/M/MV5BMzdjNjI5MmYtODhiNS00NTcyLWEzZmUtYzVmODM5YzExNDE3XkEyXkFqcGdeQXVyMTAyMjQ3NzQ1._V1_.jpg', 'static/Posters/The_Menu.jpg', function(){console.log('The_Menu.jpg downloaded');});
    movies.push({
        movieName: "The Menu",
        poster: "The_Menu.jpg",
        description: "A young couple travel to a remote island to eat at an exclusive restaurant where the chef has prepared a lavish menu, with some shocking surprises.",
        actors: "Ralph Fiennes, Anya Taylor-Joy, Nicholas Hoult, Hong Chau, Janet McTeer, Paul Adelstein",
        directors:"Mark Mylod",
        releaseDate: new Date("2022-11-18"),
        trailerURL: "https://www.youtube.com/watch?v=C_uTkUGcHv4",
        country: "United States of America",
        ageRestriction: 16,
        IMDBscore: "7.5",
        genre: "Comedy, Horror/Thriller",
        duration: 107
    });

    //Oups! J'ai encore raté l'arche
    download('https://m.media-amazon.com/images/M/MV5BZjM3NDE4NTYtYWJkYy00NWI5LThmNjMtYTFkMGNjMzdiMDU2XkEyXkFqcGdeQXVyNjYxNzY5MjE@._V1_.jpg', 'static/Posters/Two_by_Two_Overboard!.jpg', function(){console.log('Two_by_Two_Overboard!.jpg downloaded');});
    movies.push({
        movieName: "Two by Two: Overboard!",
        poster: "Two_by_Two_Overboard!.jpg",
        description: "Adrift on a flood, two misfit castaways struggle to reunite an unorthodox family, out-run a volcano, and negotiate a peace deal on a creaking Ark.",
        actors: "Max Carolan, Ava Connolly, Dermot Magennis, Tara Flynn, Mary Murray",
        directors:"Toby Genkel, Sean McCormack",
        releaseDate: new Date("2022-12-21"),
        trailerURL: "https://www.youtube.com/watch?v=qf1LcI6dekk",
        country: "Germany",
        ageRestriction: 3,
        IMDBscore: "5.8",
        genre: "Animation, Family/Kids",
        duration: 86
    });

    //Devotion
    download('https://m.media-amazon.com/images/M/MV5BMjI5NGJjMmEtODk4Yy00ZDRjLWE5ZGItMjJiNGM4NTI0NmZkXkEyXkFqcGdeQXVyNjk1Njg5NTA@._V1_.jpg', 'static/Posters/Devotion.jpg', function(){console.log('Devotion.jpg downloaded');});
    movies.push({
        movieName: "Devotion",
        poster: "Devotion.jpg",
        description: "A pair of U.S. Navy fighter pilots risk their lives during the Korean War and become some of the Navy's most celebrated wingmen.",
        actors: "Jonathan Majors, Glen Powell, Christina Jackson, Thomas Sadoski, Daren Kagasoff, Joe Jonas",
        directors:"J.D. Dillard",
        releaseDate: new Date("2022-12-23"),
        trailerURL: "https://www.youtube.com/watch?v=NCDEGP6VjYY",
        country: "United States of America",
        ageRestriction: 12,
        IMDBscore: "7.0",
        genre: "Drama, Action",
        duration: 139
    });

    //Violent night
    download('https://m.media-amazon.com/images/M/MV5BYzg2NWNhOWItYjA3Yi00MzhhLTg4ZmItYzM3ZTIwN2U0ZGQ5XkEyXkFqcGdeQXVyMzEyMDQzNzY@._V1_.jpg', 'static/Posters/Violent_Night.jpg', function(){console.log('Violent_Night.jpg downloaded');});
    movies.push({
        movieName: "Violent Night",
        poster: "Violent_Night.jpg",
        description: "When a group of mercenaries attack the estate of a wealthy family, Santa Claus must step in to save the day (and Christmas).",
        actors: "David Harbour, John Leguizamo, Beverly D'Angelo, Alex Hassell, Alexis Louder, Edi Patterson, Cam Gigandet",
        directors:"Tommy Wirkola",
        releaseDate: new Date("2022-12-2"),
        trailerURL: "https://www.youtube.com/watch?v=a53e4HHnx_s",
        country: "United States of America",
        ageRestriction: 16,
        IMDBscore: "7.0",
        genre: "Action, Crime, Comedy, Thriller, ",
        duration: 111
    });

    //The Whale
    download('https://m.media-amazon.com/images/M/MV5BZDQ4Njg4YTctNGZkYi00NWU1LWI4OTYtNmNjOWMyMjI1NWYzXkEyXkFqcGdeQXVyMTA3MDk2NDg2._V1_.jpg', 'static/Posters/The_Whale.jpg', function(){console.log('The_Whale.jpg downloaded');});
    movies.push({
        movieName: "The Whale",
        poster: "The_Whale.jpg",
        description: "A reclusive English teacher attempts to reconnect with his estranged teenage daughter.",
        actors: "Brendan Fraser, Sadie Sink, Ty Simpkins, Hong Chau, Samantha Morton",
        directors:"Darren Aronofsky",
        releaseDate: new Date("2022-12-21"),
        trailerURL: "https://www.youtube.com/watch?v=D30r0CwtIKc",
        country: "United States of America",
        ageRestriction: 16,
        IMDBscore: "8.2",
        genre: "Drama",
        duration: 117
    });

    //Upcoming releases

    //Mario Bros
    download('https://m.media-amazon.com/images/M/MV5BYjY5MTYwMDYtNDk4OS00NmE1LWI2ZjItY2Q5ZmVmNTU4NTAyXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg', 'static/Posters/The_Super_Mario_Bros_Movie.jpg', function(){console.log('The_Super_Mario_Bros_Movie.jpg downloaded');});
    movies.push({
        movieName: "The Super Mario Bros. Movie",
        poster: "The_Super_Mario_Bros_Movie.jpg",
        description: "The story of The Super Mario Bros. on their journey through the Mushroom Kingdom.",
        actors: "Chris Pratt, Anya Taylor-Joy, Charlie Day, Jack Black, Keegan-Michael Key, Seth Rogen",
        directors:"Aaron Horvath, Michael Jelenic",
        releaseDate: new Date("2023-3-22"),
        trailerURL: "https://www.youtube.com/watch?v=KydqdKKyGEk",
        country: "United States of America",
        ageRestriction: 3,
        IMDBscore: "N/A",
        genre: "Animation, Family/Kids",
        duration: 1
    });

    //Ant-man
    download('https://m.media-amazon.com/images/M/MV5BNDgyNGM4NTYtN2M3MS00YTY2LTk0OWUtZmIzYjg3MmQ0OGM4XkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_.jpg', 'static/Posters/Ant-Man_and_the_Wasp_Quantumania.jpg', function(){console.log('Ant-Man_and_the_Wasp_Quantumania.jpg downloaded');});
    movies.push({
        movieName: "Ant-Man and the Wasp: Quantumania",
        poster: "Ant-Man_and_the_Wasp_Quantumania.jpg",
        description: "Scott Lang and Hope Van Dyne, along with Hank Pym and Janet Van Dyne, explore the Quantum Realm, where they interact with strange creatures and embark on an adventure that goes beyond the limits of what they thought was possible.",
        actors: "Paul Rudd, Evangeline Lilly, Jonathan Majors, Kathryn Newton, William Jackson Harper, Michelle Pfeiffer, Michael Douglas, Bill Murray",
        directors:"Peyton Reed",
        releaseDate: new Date("2023-2-15"),
        trailerURL: "https://www.youtube.com/watch?v=ZlNFpri-Y40",
        country: "United States of America",
        ageRestriction: 12,
        IMDBscore: "N/A",
        genre: "Action, Adventure",
        duration: 1
    });

    //John Wick 4
    download('https://m.media-amazon.com/images/M/MV5BMDExZGMyOTMtMDgyYi00NGIwLWJhMTEtOTdkZGFjNmZiMTEwXkEyXkFqcGdeQXVyMjM4NTM5NDY@._V1_.jpg', 'static/Posters/John_Wick_4.jpg', function(){console.log('John_Wick_4.jpg downloaded');});
    movies.push({
        movieName: "John Wick 4",
        poster: "John_Wick_4.jpg",
        description: "John Wick uncovers a path to defeating The High Table. But before he can earn his freedom, Wick must face off against a new enemy with powerful alliances across the globe and forces that turn old friends into foes.",
        actors: "Keanu Reeves, Donnie Yen, Bill Skarsgård, Laurence Fishburne, Hiroyuki Sanada, Shamier Anderson",
        directors:"Chad Stahelski",
        releaseDate: new Date("2023-3-22"),
        trailerURL: "https://www.youtube.com/watch?v=qEVUtrk8_B4",
        country: "United States of America",
        ageRestriction: 16,
        IMDBscore: "N/A",
        genre: "Action",
        duration: 1
    });

    //Transformers
    download('https://m.media-amazon.com/images/M/MV5BN2FkOWQ3YzItNmNhZi00ZWNlLThjYTMtZWIyZDc2YjQzMjk3XkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg', 'static/Posters/Transformers_Rise_of_the_Beasts.jpg', function(){console.log('Transformers_Rise_of_the_Beasts.jpg downloaded');});
    movies.push({
        movieName: "Transformers: Rise of the Beasts",
        poster: "Transformers_Rise_of_the_Beasts.jpg",
        description: "Returning to the action and spectacle that made the original Transformers a worldwide phenomenon 14 years ago, Transformers: Rise of The Beasts will take audiences on a globe-trotting adventure set in the 1990s. The Maximals, Predacons and Terrorcons will be introduced for the first time as they join the ongoing battle between the Autobots and Decepticons.",
        actors: "Michelle Yeoh, Ron Perlman, Peter Dinklage, Pete Davidson, Luna Lauren Velez, Anthony Ramos",
        directors:"Steven Caple Jr.",
        releaseDate: new Date("2023-6-7"),
        trailerURL: "https://www.youtube.com/watch?v=P8p_otV-lys",
        country: "United States of America",
        ageRestriction: 12,
        IMDBscore: "N/A",
        genre: "Action, Adventure, Science fiction",
        duration: 1
    });

    //Spider-man: Across the spiderverse
    download('https://m.media-amazon.com/images/M/MV5BNDAzY2FkNjAtZGZlOS00YTE2LWE4YjctOGMwYzIxZWU4MDRiXkEyXkFqcGdeQXVyMTUzMTg2ODkz._V1_.jpg', 'static/Posters/Spider-Man_Across_the_Spider-Verse.jpg', function(){console.log('Spider-Man_Across_the_Spider-Verse.jpg downloaded');});
    movies.push({
        movieName: "Spider-Man: Across the Spider-Verse",
        poster: "Spider-Man_Across_the_Spider-Verse.jpg",
        description: "Miles Morales returns for the next chapter of the Oscar®-winning Spider-Verse saga, an epic adventure that will transport Brooklyn's full-time, friendly neighborhood Spider-Man across the Multiverse to join forces with Gwen Stacy and a new team of Spider-People to face off with a villain more powerful than anything they have ever encountered.",
        actors: "Shameik Moore, Hailee Steinfeld, Oscar Isaac, Jake Johnson, Issa Rae, Brian Tyree Henry, Luna Lauren Velez",
        directors:"Joaquim Dos Santos, Kemp Powers, Justin K. Thompson",
        releaseDate: new Date("2023-6-2"),
        trailerURL: "https://www.youtube.com/watch?v=cqGjhVJWtEg",
        country: "United States of America",
        ageRestriction: 6,
        IMDBscore: "N/A",
        genre: "Animation, Action, Adventure",
        duration: 1
    });

    //Barbie
    download('https://m.media-amazon.com/images/M/MV5BNzliODE4NDQtYzEwNy00N2QyLTk2ZGQtZGZhNDU0NjVlZDMyXkEyXkFqcGdeQXVyMTU0Mjc4MTY4._V1_.jpg', 'static/Posters/Barbie.jpg', function(){console.log('Barbie.jpg downloaded');});
    movies.push({
        movieName: "Barbie",
        poster: "Barbie.jpg",
        description: "Barbie lives in Barbie Land and then a story happens.",
        actors: "Margot Robbie, Will Ferrell, Ryan Gosling, Ariana Greenblatt, Emma Mackey, Helen Mirren",
        directors:"Greta Gerwig",
        releaseDate: new Date("2023-7-19"),
        trailerURL: "https://www.youtube.com/watch?v=8zIf0XvoL9Y",
        country: "United States of America",
        ageRestriction: 6,
        IMDBscore: "N/A",
        genre: "Adventure, Fantasy",
        duration: 1
    });

    //Babylon
    download('https://m.media-amazon.com/images/M/MV5BNjlkYjc4NGMtZjc3MS00NjQ3LTk4MmUtMTkwZGZjODE1ZDVlXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_.jpg', 'static/Posters/Babylon.jpg', function(){console.log('Babylon.jpg downloaded');});
    movies.push({
        movieName: "Babylon",
        poster: "Babylon.jpg",
        description: "A tale of outsized ambition and outrageous excess, it traces the rise and fall of multiple characters during an era of unbridled decadence and depravity in early Hollywood.",
        actors: "Brad Pitt, Margot Robbie, Diego Calva, Tobey Maguire, Jean Smart, Jean Smart",
        directors:"Damien Chazelle",
        releaseDate: new Date("2023-1-18"),
        trailerURL: "https://www.youtube.com/watch?v=5muQK7CuFtY",
        country: "United States of America",
        ageRestriction: 12,
        IMDBscore: "N/A",
        genre: "Comedy, Drama",
        duration: 1
    });

    //Creed III
    download('https://m.media-amazon.com/images/M/MV5BZDNlZmRkM2UtZTBiYy00YTlhLThkZmEtM2YwY2FkMTUwZjViXkEyXkFqcGdeQXVyMTMzNDE5NDM2._V1_.jpg', 'static/Posters/Creed_III.jpg', function(){console.log('Creed_III.jpg downloaded');});
    movies.push({
        movieName: "Creed III",
        poster: "Creed_III.jpg",
        description: "Adonis has been thriving in both his career and family life, but when a childhood friend and former boxing prodigy resurfaces, the face-off is more than just a fight.",
        actors: "Jonathan Majors, Michael B. Jordan, Tessa Thompson, Selenis Leyva, Wood Harris, Phylicia Rashad",
        directors:"Michael B. Jordan",
        releaseDate: new Date("2023-3-1"),
        trailerURL: "https://www.youtube.com/watch?v=AHmCH7iB_IM",
        country: "United States of America",
        ageRestriction: 12,
        IMDBscore: "N/A",
        genre: "Drama, Action",
        duration: 1
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