const {Model, DataTypes} = require("sequelize");
const sequelize = require("./database");

class Movie extends Model {
}

Movie.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    genre:{
        type: DataTypes.TEXT,
        allowNull: false,
        references: {
            model: Genre,
            key: "genreCode"
        }
    },
    movieName: {
        type: DataTypes.TEXT,
        allowNull: false,
        primaryKey: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    releaseDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    trailerURL:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    country:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    ageRestriction:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    IMDBscore:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    timestamps: false,
    createdAt: false,
    updatedAt: false,
}, {sequelize})
module.exports = Movie