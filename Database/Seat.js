const {Model, DataTypes} = require("sequelize");
const sequelize = require("./database");
const Hall = require("./Hall");

class Seat extends Model {
}

Seat.init({
    id:{        
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey:true
    },
    codeAvaible:{        
        type: DataTypes.BOOLEAN,
        defaultValue:true,
        primaryKey:true
    },
    hallId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Hall,
            key: "id"
        },
        primaryKey:true
    },
    timestamps: true,
    createdAt: false,
    updatedAt: false,
}, {sequelize})
module.exports = Seat
