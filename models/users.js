'use strict';
module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define('users', {
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    totalcorrect: DataTypes.INTEGER,
    totalwrong: DataTypes.INTEGER,
    totalanswered: DataTypes.INTEGER,
    average: DataTypes.DOUBLE
  }, {timestamps: false});
  users.associate = function(models) {
    // associations can be defined here
  };
  return users;
};