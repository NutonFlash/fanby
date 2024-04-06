const sequelize = require("../../sequelize");
const Account = require("../../models/Account");
const AccountStatistics = require("../../models/AccountStatistics");
const Proxy = require("../../models/Proxy");
const { validUsername, validPassword } = require("./utils");

async function addAccounts(req, res) {
  const userId = req.user.id;

  const { username, password, proxyId } = req.body;

  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }
  if (!password) {
    return res.status(400).json({ error: "Password is required" });
  }
  if (!validUsername(username)) {
    return res.status(400).json({ error: "Invalid username format" });
  }
  if (!validPassword(password)) {
    return res.status(400).json({ error: "Invalid password format" });
  }

  try {
    const result = await sequelize.transaction(async (t) => {
      const isAccountExist = await Account.findOne({
        where: { username },
      });

      if (isAccountExist) {
        return {
          type: "error",
          message: "Account already added in the system",
          status: 400,
        };
      }

      if (proxyId) {
        const isProxyExist = await Proxy.findOne({
          where: { id: proxyId },
        });
        if (!isProxyExist) {
          return {
            type: "error",
            message: "Chosen proxy not found",
            status: 400,
          };
        }
      }

      const newAccount = await Account.create({
        username,
        password,
        userId,
        proxyId,
      });

      const newAccountStatistics = await AccountStatistics.create({
        accountId: newAccount.id,
      });

      const data = {
        ...newAccount.toJSON(),
        accountStatistics: newAccountStatistics.toJSON(),
      };
      
      return {
        type: "success",
        data: {
          ...newAccount.toJSON(),
          accountStatistics: newAccountStatistics.toJSON(),
        },
      };
    });

    if (result.type === "error") {
      return res.status(result.status).json({ error: result.message });
    }
    res.json(result.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "The database is currently unavailable." });
  }
}

module.exports = addAccounts;
