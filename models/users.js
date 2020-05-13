'use strict';
module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define('users', {
    userName: DataTypes.STRING,
    email: DataTypes.STRING,
    totalCorrect: DataTypes.INTEGER,
    totalWrong: DataTypes.INTEGER,
    average: DataTypes.DOUBLE
  }, {});
  users.associate = function(models) {
    // associations can be defined here
  };
  return users;
};