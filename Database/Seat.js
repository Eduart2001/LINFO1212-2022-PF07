const {Model, DataTypes} = require("sequelize");
const sequelize = require("./database");
const Hall = require("./Hall");

class Seat extends Model {
}

Seat.init({
    id:{
        type: DataTypes.TEXT,
        allowNull: false,
        primaryKey:true
    },
    codeAvaible:{
        type: DataTypes.BOOLEAN,
        defaultValue:true
    },
    timestamps: true,
    createdAt: false,
    updatedAt: false,
}, {sequelize})
module.exports = Seat
