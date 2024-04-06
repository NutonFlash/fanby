const sequelize = require("../../sequelize");
const Account = require("../../models/Account");

async function deleteAccounts(req, res) {
  const userId = req.user.id;
  const { ids } = req.query;

  if (!ids) {
    return res.status(400).send("Ids query is required");
  }

  const idsToDelete = ids.split(',');

  try {
    await sequelize.transaction(async (t) => {
      await Account.destroy({
        where: { userId, id: idsToDelete },
      });
    });
    return res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "The database is currently unavailable." });
  }
}

module.exports = deleteAccounts;
