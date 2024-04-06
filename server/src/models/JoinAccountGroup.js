const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");
const Account = require("./Account");
const Group = require("./Group");

const JoinAccountGroup = sequelize.define("JoinAccountGroup", {
  isUsed: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

Account.hasMany(JoinAccountGroup, {
  foreignKey: {
    name: "accountId",
    allowNull: false,
  },
});
JoinAccountGroup.belongsTo(Account, {
  foreignKey: {
    name: "accountId",
    allowNull: false,
  },
});

Group.hasMany(JoinAccountGroup, {
  foreignKey: {
    name: "groupId",
    allowNull: false,
  },
});
JoinAccountGroup.belongsTo(Group, {
  foreignKey: {
    name: "groupId",
    allowNull: false,
  },
});

module.exports = JoinAccountGroup;
