const sequelize = require("./server_express").sequelize;
const TimeTable = require("./server_express").TimeTable;

async function getTimeTableById(hallId){
    try {
        const [result, meta] = await sequelize.query(`Select * From TimeTable where id = ${hallId}`);
        return result;
    } catch {
        return [];
    }

}
async function add(object){
    TimeTable.create(object)
}

module.exports={
    getTimeTableById : getTimeTableById,
    add:add,
}