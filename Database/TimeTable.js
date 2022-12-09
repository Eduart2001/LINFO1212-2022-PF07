const {Model, DataTypes} = require("sequelize");
const sequelize = require("./database");
const Hall = require("./Hall");
const Movie = require("./Movie");
class TimeTable extends Model {
}

TimeTable.init({
    TimeTableId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey:true
    },
    hall:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Hall,
            key: "id"
        },
    },
    movieId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Movie,
            key: "id"
        },
    },
    day:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey:true
    },
    time:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey:true
    },
    timestamps: true,
    createdAt: false,
    updatedAt: false,
}, {sequelize})
module.exports = TimeTable
