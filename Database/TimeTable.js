const {Model, DataTypes} = require("sequelize");
const sequelize = require("./database");
const Hall = require("./Hall");
const Movie = require("./Movie")

class TimeTable extends Model {
}

TimeTable.init({
    hallId:{        
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Halls',
            key: "id"
        },
        primaryKey:true,
    },
    movieId:{        
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Movies', // 'Movies' would also work
            key: 'id'
          },
        onDelete:'CASCADE'
    },
    day:{        
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey:true
    },
    time:{        
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey:true
    },
    timestamps: true,
    createdAt: false,
    updatedAt: false,
}, {sequelize})
module.exports = TimeTable