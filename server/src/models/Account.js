const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");
const User = require("./User");
const Proxy = require("./Proxy");

const Account = sequelize.define("Account", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  avatar: {
    type: DataTypes.STRING,
    defaultValue: "",
  },
  followers: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  posts: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  groups: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  activityTotal: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  retweetsTotal: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  messagesTotal: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  isActivated: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  expirationDate: {
    type: DataTypes.DATE,
    defaultValue: Date.now,
  },
});

User.hasOne(Account, {
  foreignKey: {
    name: "userId",
    allowNull: false,
  },
});
Account.belongsTo(User, {
  foreignKey: {
    name: "userId",
    allowNull: false,
  },
});

Proxy.hasMany(Account, {
  foreignKey: {
    name: "proxyId",
  },
});
Account.belongsTo(Proxy, {
  foreignKey: {
    name: "proxyId",
  },
});

module.exports = Account;
