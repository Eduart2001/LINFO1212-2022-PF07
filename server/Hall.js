const { get } = require("http");

const sequelize = require("./server_express").sequelize;
const Hall=require("./server_express").Hall;

function create3Halls(){
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