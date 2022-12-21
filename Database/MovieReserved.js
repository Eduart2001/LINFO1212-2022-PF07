const {Model, DataTypes} = require("sequelize");
const sequelize = require("./database");

const User =require("./User");
const Movie=require("./Movie");
const Seat=require("./Seat")
const Timetable=require("./TimeTable");
const Hall = require("./Hall");

class MovieReserved extends Model{
}

MovieReserved.init({

    id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement:true,
        primaryKey:true
    },

    email:{
        type:DataTypes.TEXT,
        allowNull:false
    },

    movieName:{
        type:DataTypes.TEXT,
        allowNull:false
    },
    HallNumber:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    SeatNumber:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    Day:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    Hour:{
        type:DataTypes.INTEGER,
        allowNull:false
    }
},{sequelize})
module.exports = MovieReserved