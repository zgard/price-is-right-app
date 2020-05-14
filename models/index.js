// https://devcenter.heroku.com/articles/heroku-postgresql#connecting-in-node-js
// https://medium.com/@ochieng.grace/sequelize-your-way-to-heroku-with-express-2c31be3752e0 
// for heroku guide to setup
// testing
'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db = {};

console.log(process.env.DATABASE_URL);

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(console.log(process.env[config.use_env_variable], config));
} else {
  sequelize = new Sequelize(console.log(config.database, config.username, config.password, config));
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
