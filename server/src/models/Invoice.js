const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");
const User = require("./User");

const Invoice = sequelize.define("Invoices", {
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  link: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  received: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: "USDT_TRX",
  },
  status: {
    type: DataTypes.ENUM(
      "Created",
      "Pending",
      "Expired",
      "Completed",
      "Error",
      "Unknown"
    ),
    defaultValue: "Created",
  },
});

User.hasOne(Invoice, {
  foreignKey: {
    name: "userId",
    allowNull: false,
  },
});
Invoice.belongsTo(User, {
  foreignKey: {
    name: "userId",
    allowNull: false,
  },
});

module.exports = Invoice;
