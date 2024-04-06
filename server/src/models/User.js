const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

const User = sequelize.define("User", {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  hashedPwd: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  referalCode: {
    type: DataTypes.STRING,
  },
  activationsLeft: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

module.exports = User;
