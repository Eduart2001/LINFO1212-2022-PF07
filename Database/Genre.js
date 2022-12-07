const {Model, DataTypes} = require("sequelize");
const sequelize = require("./database");

class Genre extends Model {
}

Genre.init({
    movieName:{
        type: DataTypes.TEXT,
        allowNull: false,
        references: {
            model: Movie,
            key: "movieName"
        },
        primaryKey:true
    },
    genreCode:{
        type: DataTypes.TEXT,
        allowNull: false,
        references: {
            model: Movie,
            key: "movieName"
        },
        primaryKey:true
    },
    timestamps: true,
    createdAt: false,
    updatedAt: false,
}, {sequelize})
module.exports = Genre
