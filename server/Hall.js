const sequelize = require("../server/server_express").sequelize;
const Hall=require("../server_express").Hall;

function createHalls(){
    Hall.create({
        id:{        
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey:true
        },
        capacity:{        
            type: DataTypes.INTEGER,
            allowNull: false
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
        seat:{
            type: DataTypes.TEXT,
            allowNull: false,
            references: {
                model: Seat,
                key: "id"
            }
        },
    })
}