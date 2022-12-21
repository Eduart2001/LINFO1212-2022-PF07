const sequelize = require("./server_express").sequelize;
const TimeTable = require("./server_express").TimeTable;
const movie = require("./movie");
const hall=require("./hall");
const seat=require("./seat")
async function getTimeTableById(id){
    try {
        const [result, meta] = await sequelize.query(`Select * From TimeTables where hallId = ${id}`);
        return result;
    } catch {
        return [];
    }

}
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
async function add(object){
    TimeTable.create(object)
}

module.exports={
    getTimeTable : getTimeTable,
    add:add,
    getTimeTableByMovie:getTimeTableByMovie,
}