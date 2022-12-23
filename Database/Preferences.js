const {Model, DataTypes} = require("sequelize");
const sequelize = require("./database");
const User = require("./User");

class Preferences extends Model {
}

Preferences.init({
    email:{      
        type: DataTypes.TEXT,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'email'
            },
        onDelete:'CASCADE',
        primaryKey:true,
    },
    darkMode:{
        type: DataTypes.TEXT,
        primaryKey:true
    },
    showAll:{
        type: DataTypes.TEXT,
        primaryKey:true
    },
    timestamps: true,
    createdAt: false,
    updatedAt: false,
}, {sequelize})
module.exports = Preferences
