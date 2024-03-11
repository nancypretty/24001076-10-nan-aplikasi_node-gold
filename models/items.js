'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Items extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      
    }
  }
  Items.init({
    name: {
      type : DataTypes.STRING, 
      allowNull : false,
    },
    price: {
      type : DataTypes.DECIMAL, 
      allowNull : false,
    },
    stock: {
      type : DataTypes.INTEGER, 
      allowNull : false,
    },
  }, {
    sequelize,
    modelName: 'Items',
  });
  return Items;
};