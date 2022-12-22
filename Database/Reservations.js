const {Model, DataTypes} = require("sequelize");
const sequelize = require("./database");

const User =require("./User");
const Movie=require("./Movie");
const Seat=require("./Seat")
const Timetable=require("./TimeTable");
const Hall = require("./Hall");
const seat = require("../server/seat");

class Reservations extends Model{
}

Reservations.init({

    email:{        
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    session:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Seat',
            key: 'timeTableId'
          },
    },
    seat:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Seat', 
            key: 'id'
          },
    },
    
},{sequelize})
module.exports = Reservations