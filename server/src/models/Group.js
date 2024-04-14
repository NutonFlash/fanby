const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const Group = sequelize.define('Group', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  requiredRetweets: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  usersTotal: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  usersFollowersTotal: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  usersActivityRate: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  rating: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  bestStartTime: {
    type: DataTypes.STRING,
    defaultValue: '18:00'
  },
  bestEndTime: {
    type: DataTypes.STRING,
    defaultValue: '22:00'
  }
});

module.exports = Group;
