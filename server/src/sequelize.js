const { Sequelize } = require('sequelize');
const cls = require('cls-hooked');

const namespace = cls.createNamespace('sequelize-transaction-namespace');

Sequelize.useCLS(namespace);

const sequelize = new Sequelize('fanby', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql',
  retry: {
    max: 10,
    timeout: 10000
  }
});

(async function () {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    // await sequelize.sync({ alter: true });
    await sequelize.sync();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

module.exports = sequelize;
