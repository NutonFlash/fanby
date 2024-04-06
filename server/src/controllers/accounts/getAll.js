const sequelize = require("../../sequelize");
const Account = require("../../models/Account");
const AccountStatistics = require("../../models/AccountStatistics");
const Group = require("../../models/Group");

async function fetchAllAccounts(req, res) {
  const userId = req.user.id;

  const { withStats, withGroups } = req.query;

  // const include = [];

  // if (withStats) {
  //   include.push(AccountStatistics);
  //   include.push(Group);
  // }

  try {
    const result = await sequelize.transaction(async (t) => {
      const accounts = await Account.findAll({
        where: { userId },
        // include,
      });
      // if (withStats) {
      //   for (const account of accounts) {
      //     account.dataValues.accountStatistics.groupTotal =
      //       account.dataValues.Groups.length;
      //   }
      // }
      return accounts.map((account) => account.toJSON());
    });
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "The database is currently unavailable." });
  }
}

module.exports = fetchAllAccounts;
