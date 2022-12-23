const { get } = require("http");

const sequelize = require("../Database/database");
const Hall=require("../Database/Hall");

async function create3Halls(){
    if ((await getAllHalls()).length == 0){
        console.log("empty Movies table");
        Hall.create({
            id:1,
            capacity:50
    
        })
        Hall.create({
            capacity:40
    
        })
        Hall.create({
            capacity:60
    
        })
        return "ok";
    } else{
        console.log("Movies table is not empty");
        return "not ok";
    }
}
async function getAllHalls(){
        const [result, meta] = await sequelize.query("SELECT * from Halls");
        return result;
}
async function getHallCapacity(id){
        const [result, meta] = await sequelize.query(`SELECT capacity from Halls where id='${id}'`);
        return result;
}
module.exports={
    getAllHalls:getAllHalls,
    create3Halls:create3Halls,
    getHallCapacity:getHallCapacity,
}