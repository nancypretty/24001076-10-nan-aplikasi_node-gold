'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Orders extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
    }
  }
  Orders.init({
    user_id: {
      type : DataTypes.DECIMAL,
      allowNull : false},
    item_id: {
      type : DataTypes.DECIMAL,
      allowNull : false},
    bill: {
      type : DataTypes.DECIMAL,
      allowNull : false},
    status: {
      type : DataTypes.STRING,
      allowNull : false
    }
  }, {
    sequelize,
    modelName: 'Orders',
  });
  return Orders;
};