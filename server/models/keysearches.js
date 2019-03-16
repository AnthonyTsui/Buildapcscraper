'use strict';
module.exports = (sequelize, DataTypes) => {
  const keysearches = sequelize.define('keysearches', 
  {
    title: 
    {
    	type: DataTypes.STRING, 
    },
    itemtype:
    {
    	type: DataTypes.STRING,
    },

  }, {});

  keysearches.associate = (models) => {
    // associations can be defined here
    keysearches.hasMany(models.searchresults,
    {
        foreignKey: 'searchID',
        as: 'searchresults',

    });
  };

  return keysearches;
};