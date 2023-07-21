const Sequelize = require('sequelize');

require('dotenv').config();

const sequelize = new Sequelize('expense-tracker', 'root', 'user@1234567' ,{ //process.env.DB_NAME , process.env.DB_USERNAME , process.env.DB_PASSWORD ,{
    dialect: 'mysql',
    host: 'localhost'//process.env.DB_HOST
});

module.exports = sequelize;