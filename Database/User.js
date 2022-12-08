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
    name: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    admin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    timestamps: false,
    createdAt: false,
    updatedAt: false,
}, {sequelize})
module.exports = User