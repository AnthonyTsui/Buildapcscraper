'use strict';
module.exports = (sequelize, DataTypes) => {
  const searchresults = sequelize.define('searchresults', 
  {
    title: 
    {
    	type: DataTypes.STRING, 
    	allowNull:false,
    },
    image:
    {
    	type: DataTypes.STRING,
    	allowNull:false,
    },
    link:
    {
    	type: DataTypes.STRING,
    },
    price:
    {
    	type: DataTypes.STRING,
    },
    source:
    {
    	type: DataTypes.STRING,
    },

  }, {});
  searchresults.associate = (models) => {
    // associations can be defined here
    searchresults.belongsTo(models.keysearches, {
    	foreignKey: 'searchterm',
    	onDelete: 'CASCADE',

    });

  };
  return searchresults;
};