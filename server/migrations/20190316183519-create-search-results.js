'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('searchresults', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING,
      },
      image:
      {
        type: Sequelize.STRING,
      },
      link:
      {
        type: Sequelize.STRING,
      },
      price:
      {
        type:Sequelize.STRING,
      },
      source:
      {
        type:Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      searchterm: {
        type:Sequelize.STRING,
        onDelete: 'CASCADE',
        references:{
          model: 'keysearches',
          key: 'title',
          as: 'searchterm',
        },
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('searchresults');
  }
};