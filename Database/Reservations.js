const {Model, DataTypes} = require("sequelize");
const sequelize = require("./database");

const User =require("./User");
const Seat=require("./Seat")

class Reservations extends Model{
}

Reservations.init({

    email:{        
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    seat:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Seats', 
            key: 'id',
          },
        onDelete:'CASCADE',
    },
    session:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Seats',
            key: 'timeTableId'
          },
        onDelete:'CASCADE',
    },
    
},{sequelize})

module.exports = Reservations