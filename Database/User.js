const {Model, DataTypes} = require("sequelize");
const sequelize = require("./database");

class User extends Model {
}

User.init({
    email: {
        type: DataTypes.TEXT,
        allowNull: false,
        primaryKey: true
    },
    birthdate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    password: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    firstName: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    lastName: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    phoneNumber:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    sex:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    timestamps: false,
    createdAt: false,
    updatedAt: false,
}, {sequelize})
module.exports = User