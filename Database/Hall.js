const {Model, DataTypes} = require("sequelize");
const sequelize = require("./database");
const Seat = require("./Seat");

class Hall extends Model {
}

Hall.init({
    id:{        
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey:true
    },
    capacity:{        
        type: DataTypes.INTEGER,
        allowNull: false
    },
    movieId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Movie,
            key: "id"
        },
        primaryKey:true
    },
    seat:{
        type: DataTypes.TEXT,
        allowNull: false,
        references: {
            model: Seat,
            key: "id"
        }
    },
    timestamps: true,
    createdAt: false,
    updatedAt: false,
}, {sequelize})
module.exports = Hall
