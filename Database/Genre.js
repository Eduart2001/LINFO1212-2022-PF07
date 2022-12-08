const {Model, DataTypes} = require("sequelize");
const sequelize = require("./database");

class Genre extends Model {
}

Genre.init({
    genreCode:{
        type: DataTypes.TEXT,
        allowNull: false,
        primaryKey:true
    },
    timestamps: true,
    createdAt: false,
    updatedAt: false,
}, {sequelize})
module.exports = Genre
