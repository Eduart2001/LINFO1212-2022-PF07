const { get } = require("http");

const sequelize = require("./server_express").sequelize;
const Hall=require("./server_express").Hall;

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
    try {
        const [result, meta] = await sequelize.query("SELECT * from Halls");
        return result;
    } catch {
        return [];
    }
}
module.exports={
    getAllHalls:getAllHalls,
    create3Halls:create3Halls
}