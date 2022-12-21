const sequelize = require("./server_express").sequelize;
const Seat = require("./server_express").Seat;


async function getReservedSeatsForTimeTable(timeTable){
    try{
        const [result,meta]=await sequelize.query(`Select id from Seats where timeTableId='${timeTable}'`);
        return result;

    }catch (e){
        return []
    }
}


function addSeats(){
    for(var x =0; x<49;x++){
        Seat.create({
            id:x,
            timeTableId:1230,
        })
    }
    for(var x =11; x<20;x++){
        Seat.create({
            id:x,
            timeTableId:2221,
        })
    }
}
module.exports={
    addSeats:addSeats,
    getReservedSeatsForTimeTable:getReservedSeatsForTimeTable,
}