const sequelize = require("../Database/database");
const TimeTable = require("../Database/TimeTable");
const movie = require("./movie");
const hall=require("./hall");
const seat=require("./seat")

/**
 * Retrieve the TimeTable record with the specified ID.
 *
 * @param {number} id - The ID of the TimeTable record to retrieve.
 * @returns {Array} - An array containing the TimeTable record, or an empty array if no record was found.
 */
async function getTimeTableById(id){
    try {
        const [result, meta] = await sequelize.query(`Select * From TimeTables where hallId = ${id}`);
        return result;
    } catch {
        return [];
    }

}


/**
 * Retrieve the TimeTable records with the specified ID and transform them into an array of objects with additional movie data.
 *
 * @param {number} id - The ID of the TimeTable records to retrieve.
 * @returns {Array} - An array of objects containing the TimeTable records with additional movie data, or an empty array if no records were found. Each object has the following properties:
 *  - {number} hallId - The ID of the hall.
 *  - {string} movieName - The name of the movie.
 *  - {string} day - The day the movie is playing.
 *  - {string} time - The time the movie is playing.
 */
async function getTimeTable(id){
    var movieList= await getTimeTableById(id);
    var result=[]
    for(var i =0;i< movieList.length;i++){
        result.push({
            hallId:movieList[i].hallId,
            movieName:(await movie.getMovieById(movieList[i].movieId))[0].movieName,
            day:movieList[i].day,
            time:movieList[i].time,
        })
    }
    return result

}
/**
 * Retrieve the TimeTable records for a given movie and transform them into an array of objects with additional hall and movie data.
 *
 * @param {number} movieId - The ID of the movie.
 * @returns {Array} - An array of objects containing the TimeTable records with additional hall and movie data, or an error if an exception was thrown. Each object has the following properties:
 *  - {number} hallId - The ID of the hall.
 *  - {number} movieId - The ID of the movie.
 *  - {string} movieName - The name of the movie.
 *  - {string} day - The day the movie is playing.
 *  - {string} time - The time the movie is playing.
 *  - {number} availableCapacity - The number of available seats for the movie showing.
 */
async function getTimeTableByMovie(movieId){
    try{
        const [movieTimeTable, meta] = await sequelize.query(`Select * From TimeTables where movieId = ${movieId}`);
        var result=[]
        for(var i =0;i< movieTimeTable.length;i++){
            const id=movieTimeTable[i].hallId*1000+movieTimeTable[i].movieId*100+movieTimeTable[i].day*10+movieTimeTable[i].time;
            
            result.push({
                hallId:movieTimeTable[i].hallId,
                movieId:movieTimeTable[i].movieId,
                movieName:(await movie.getMovieById(movieTimeTable[i].movieId))[0].movieName,
                day:movieTimeTable[i].day,
                time:movieTimeTable[i].time,
                availableCapacity:((await hall.getHallCapacity(movieTimeTable[i].hallId))[0].capacity-(await seat.getReservedSeatsForTimeTable(id)).length)

            })
        }
        return result
    }catch (error){
        return error;
    }
}


/**
 * Add a new TimeTable record to the database.
 *
 * @param {Object} object - The TimeTable record to add. It should have the following properties:
 *  - {number} hallId - The ID of the hall.
 *  - {number} movieId - The ID of the movie.
 *  - {string} day - The day the movie is playing.
 *  - {string} time - The time the movie is playing.
 */
async function add(object){
    TimeTable.create(object)
}


/**
 * Adds some users to the database for testing purposes.
 *
 * @return {String} "example users added".
 */
function addTimeTableTest(){
    //static data for testing purposes
    const timeTable = [];

    timeTable.push({
        hallId: 1,
        movieId: 2,
        day: 2,
        time: 0
    });

    timeTable.push({
        hallId: 1,
        movieId: 2,
        day: 3,
        time: 1
    });

    timeTable.push({
        hallId: 2,
        movieId: 2,
        day: 4,
        time: 1
    });

    timeTable.push({
        hallId: 2,
        movieId: 2,
        day: 5,
        time: 1
    });

    timeTable.push({
        hallId: 1,
        movieId: 2,
        day: 3,
        time: 2
    });
    timeTable.push({
        hallId: 1,
        movieId: 4,
        day: 4,
        time: 2
    });
    for (let i = 0; i < timeTable.length; i++) {
        TimeTable.create(timeTable[i]);
    }

    return "example timeTable added";
}

/**
 * Check if the TimeTable table is empty and, if it is, add test data to it.
 *
 * @returns {string} - A string indicating whether the TimeTable table is empty or not.
 */
async function emptyTimeTableDB(){
    if ((await sequelize.query("SELECT * FROM TimeTables"))[0].length == 0){
        console.log("empty TimeTable table");
        addTimeTableTest();
        return "empty TimeTable table";
    } else{
        console.log("TimeTable table is not empty");
        return "TimeTable table is not empty";
    }
}
module.exports={
    getTimeTable : getTimeTable,
    add:add,
    getTimeTableByMovie:getTimeTableByMovie,
    emptyTimeTableDB:emptyTimeTableDB
}