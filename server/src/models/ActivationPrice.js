const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const ActivationPrice = sequelize.define('ActivationPrice', {
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

module.exports = ActivationPrice;
