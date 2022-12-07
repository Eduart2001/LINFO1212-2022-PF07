const {Model, DataTypes} = require("sequelize");
const sequelize = require("./database");

class Administrator extends Model {
}

Administrator.init({
    numberOfMovies: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    id:{
        type: DataTypes.TEXT,
        allowNull: false,
        references: {
            model: User,
            key: "email"
        },
        primaryKey:true
    },
    timestamps: false,
    createdAt: false,
    updatedAt: false,
}, {sequelize})
module.exports = Administrator
