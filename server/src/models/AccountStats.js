const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');
const Account = require('./Account');

const AccountStats = sequelize.define('AccountStats', {
  activityToday: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  retweetsToday: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  messagesToday: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
});

Account.hasMany(AccountStats, {
  foreignKey: {
    name: 'accountId',
    allowNull: false
  },
  as: 'accountStats'
});
AccountStats.belongsTo(Account, {
  foreignKey: {
    name: 'accountId',
    allowNull: false
  }
});

module.exports = AccountStats;
