const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');
const Account = require('./Account');

const AccountState = sequelize.define('AccountState', {
  isRunning: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  label: {
    type: DataTypes.ENUM(
      'Running',
      'Waiting',
      'Cooldown',
      'Disabled',
      'Error',
      'Unknown'
    ),
    defaultValue: 'Disabled'
  },
  details: {
    type: DataTypes.STRING,
    defaultValue: 'The account is in the disabled state.'
  }
});

Account.hasOne(AccountState, {
  foreignKey: {
    name: 'accountId',
    allowNull: false
  },
  as: 'state'
});
AccountState.belongsTo(Account, {
  foreignKey: {
    name: 'accountId',
    allowNull: false
  }
});

module.exports = AccountState;
