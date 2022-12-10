const sequelize = require("./server_express").sequelize;
const Movie = require("./server_express").Movie;

async function getMovieById(movieId){
    try {
        if (movieId==undefined || movieId==="") return "No id was given";
        const result = await sequelize.query(`Select * From Movies where id = '${movieId}'`);
        if (!result[0].length > 0) return "Movie with such id does not exist";
        return result[0];
    } catch (e){
        return e;
    }
}

exports.getMovieById = getMovieById;