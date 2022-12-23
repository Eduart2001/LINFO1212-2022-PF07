var express=require('express');
const { getMaxListeners } = require('process');
const MovieReserved = require('../Database/MovieReserved');
const { sequelize } = require('./server_express');
app=require("./server_express").app;

async function AllMovieUser(email){
    try{
        const [result,meta]= await sequelize.query(`SELECT * FROM MovieReserveds WHERE email= '${email}'`);
        if (await result.length>0){
            return result
        }
        return [];
    }catch(e){
        console.log("Movies Reserved error");
    }
}

async function emptyReservationDB(){
    const [result,meta]= await sequelize.query('SELECT * FROM MovieReserveds WHERE ID IS NOT NULL');
    if(await result.length>0){
        console.log("There are movies reserved");
        return "There are movies reserved";
    }
    else{
        console.log("No movies are reserved");
        return "No movies are reserved";
    }
}






module.exports={
    emptyReservationDB:emptyReservationDB,
    AllMovieUser:AllMovieUser,
}