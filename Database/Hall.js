const {Model, DataTypes} = require("sequelize");
const sequelize = require("./database");

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
        allowNull: false,
        primaryKey:true
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
    time:{
        type: DataTypes.TIME,
        allowNull: false,
        references: {
            model: TimeTable,
            key: "time"
        },
        primaryKey:true
    },
    timestamps: true,
    createdAt: false,
    updatedAt: false,
}, {sequelize})
module.exports = Hall
