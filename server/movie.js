const sequelize = require("./server_express").sequelize;
const Movie = require("./server_express").Movie;

async function getMovieById(movieId){
    const result = sequelize.query(`Select * From Movies where id = '${movieID}'`);
    if (!result[0].length > 0) return "Movie with such id does not exist";
    return result[0];
}

exports.getMovieById = getMovieById;