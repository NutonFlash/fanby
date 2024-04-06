const sequelize = require("../../sequelize");

async function checkDatabase(req, res) {
  try {
    await sequelize.authenticate();
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
}

module.exports = checkDatabase;
