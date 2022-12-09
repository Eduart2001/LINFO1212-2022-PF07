const {Model, DataTypes} = require("sequelize");
const sequelize = require("./database");
const Seat = require("./Seat");
const Movie = require("./Movie")

class Hall extends Model {
}

Hall.init({
    id:{        
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement:true,
        primaryKey:true
    },
    capacity:{        
        type: DataTypes.INTEGER,
        allowNull: false
    },
    timestamps: true,
    createdAt: false,
    updatedAt: false,
}, {sequelize})
module.exports = Hall
