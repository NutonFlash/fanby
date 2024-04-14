const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');
const User = require('./User');

const Proxy = sequelize.define('Proxy', {
  host: {
    type: DataTypes.STRING,
    allowNull: false
  },
  port: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  username: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  hashedPwd: {
    type: DataTypes.STRING,
    defaultValue: ''
  }
});

User.hasMany(Proxy, {
  foreignKey: {
    name: 'userId',
    allowNull: false
  }
});
Proxy.belongsTo(User, {
  foreignKey: {
    name: 'userId',
    allowNull: false
  }
});

module.exports = Proxy;
