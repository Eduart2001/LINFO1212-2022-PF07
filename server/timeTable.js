const sequelize = require("./server_express").sequelize;
const TimeTable = require("./server_express").TimeTable;
const movie = require("./movie");
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
async function add(object){
    TimeTable.create(object)
}

module.exports={
    getTimeTable : getTimeTable,
    add:add,
}