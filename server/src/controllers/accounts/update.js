const sequelize = require("../../sequelize");
const Account = require("../../models/Account");

async function updateAccount(req, res) {
  const userId = req.user.id;
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Id is required" });
  }

  try {
    await sequelize.transaction(async (t) => {
      const updatedAccount = await Account.update(
        { ...req.body },
        { where: { userId, id: req.params.id } }
      );
      return updatedAccount;
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "The database is currently unavailable." });
  }
  res.sendStatus(200);
}

module.exports = updateAccount;
