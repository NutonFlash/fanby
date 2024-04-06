const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");
const Account = require("./Account");

const Message = sequelize.define("Message", {
  content: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  useGif: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

Account.hasMany(Message, {
  foreignKey: {
    name: "accountId",
    allowNull: false,
  },
});
Message.belongsTo(Account, {
  foreignKey: {
    name: "accountId",
    allowNull: false,
  },
});

module.exports = Message;
