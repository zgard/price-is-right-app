'use strict';
module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define('users', {
    user_name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    total_correct: DataTypes.INTEGER,
    total_wrong: DataTypes.INTEGER,
    average: DataTypes.DOUBLE
  }, {timestamps: false});
  users.associate = function(models) {
    // associations can be defined here
  };
  return users;
};