var express=require('express');
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
        console.log("There are movies are reserved");
        return "There are movies are reserved";
    }
    else{
        testing();
        console.log("No movies are reserved");
        return "No movies are reserved";
    }
}



async function testing(){
    const Res=[];
    Res.push({
        email: 'user@example.com',
        movieName: 'Avatar 2',
        HallNumber: 1,
        SeatNumber: 3,
        Day: 5,
        Hour: 8
    });
    Res.push({
        email:"adhamez10@gmail.com",
        movieName:"Black Adam",
        HallNumber: 2,
        SeatNumber: 20,
        Day: 1,
        Hour: 1
    })
    for (let i =0; i<Res.length; i++){
        MovieReserved.create(Res[i]);
    }
}

module.exports={
    emptyReservationDB:emptyReservationDB,
    AllMovieUser:AllMovieUser,
    testing:testing
}