const {Model, DataTypes} = require("sequelize");
const sequelize = require("./database");

class TimeTable extends Model {
}

TimeTable.init({
    hall:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Hall,
            key: "id"
        },
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
        primaryKey:true
    },
    timestamps: true,
    createdAt: false,
    updatedAt: false,
}, {sequelize})
module.exports = TimeTable
