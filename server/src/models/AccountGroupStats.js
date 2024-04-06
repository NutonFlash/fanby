const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");
const JoinAccountGroup = require("./JoinAccountGroup");

const AccountGroupStats = sequelize.define("AccountGroupStats", {
  activityToday: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  retweetsToday: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  messagesToday: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

JoinAccountGroup.hasMany(AccountGroupStats, {
  foreignKey: {
    name: "joinId",
    allowNull: false,
  },
});
AccountGroupStats.belongsTo(JoinAccountGroup, {
  foreignKey: {
    name: "joinId",
    allowNull: false,
  },
});

module.exports = AccountGroupStats;
