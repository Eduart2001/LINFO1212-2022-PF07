const sequelize = require("./server_express").sequelize;
const Movie = require("./server_express").Movie;

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
module.exports={
    getMovieById : getMovieById,
    getAllMovies: getAllMovies,
}