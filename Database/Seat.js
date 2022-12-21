const {Model, DataTypes} = require("sequelize");
const sequelize = require("./database");
const TimeTable = require("./TimeTable");

class Seat extends Model {
}

Seat.init({
    id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey:true
    },
    timeTableId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey:true
    },
    timestamps: true,
    createdAt: false,
    updatedAt: false,
}, {sequelize})
module.exports = Seat
