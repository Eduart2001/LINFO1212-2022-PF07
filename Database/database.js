// Import Sequelize
const {Sequelize, DataTypes, Model} = require('sequelize')

// Creation of database link
const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "cliMax.sqlite"
})
module.exports = sequelize;