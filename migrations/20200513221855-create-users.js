'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userName: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      totalCorrect: {
        type: Sequelize.INTEGER
      },
      totalWrong: {
        type: Sequelize.INTEGER
      },
      average: {
        type: Sequelize.DOUBLE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users');
  }
};