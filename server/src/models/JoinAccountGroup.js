const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');
const Account = require('./Account');
const Group = require('./Group');

const JoinAccountGroup = sequelize.define('JoinAccountGroup', {
  isUsed: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});

Account.hasMany(JoinAccountGroup, {
  foreignKey: {
    name: 'accountId',
    allowNull: false
  },
  as: 'joinAccountGroups'
});
JoinAccountGroup.belongsTo(Account, {
  foreignKey: {
    name: 'accountId',
    allowNull: false
  },
  as: 'account'
});

Group.hasMany(JoinAccountGroup, {
  foreignKey: {
    name: 'groupId',
    allowNull: false
  },
  as: 'joinAccountGroups'
});
JoinAccountGroup.belongsTo(Group, {
  foreignKey: {
    name: 'groupId',
    allowNull: false
  },
  as: 'group'
});

module.exports = JoinAccountGroup;
