const sequelize = require("./server_express").sequelize;
const Hall=require("./server_express").Hall;

function create3Halls(){
    Hall.create({
        capacity:50

    })
    Hall.create({
        capacity:40

    })
    Hall.create({
        capacity:60

    })
}