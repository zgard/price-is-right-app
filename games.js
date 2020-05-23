const Sequelize = require('sequelize');
const sequelize = new Sequelize('price_right', 'postgres', 'postgres', {
    host: 'localhost',
    dialect: 'postgres'
});
const passport = require('passport');
const express = require('express');
const session = require('express-session');
const app = express();
const Model = Sequelize.Model;
//create constructor
class games extends Model { }
games.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },

    amount_correct: {
        type: Sequelize.INTEGER,
    },
    amount_incorrect: {
        type: Sequelize.INTEGER,
    },
    percent_correct: {
        type: Sequelize.INTEGER,
    },
},
    {
        sequelize,
        modelName: 'games'

    });

games.sync();