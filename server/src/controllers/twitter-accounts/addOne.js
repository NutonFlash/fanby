const sequelize = require('../../sequelize');
const Account = require('../../models/Account');
const AccountStats = require('../../models/AccountStats');
const AccountState = require('../../models/AccountState');
const Proxy = require('../../models/Proxy');
const { validateAccountAdd } = require('./utils');
const { encryptPassword } = require('./utils');

async function createTwitterAccount(req, res) {
  const userId = req.user.id;

  const rawAccount = req.body;

  const validationError = validateAccountAdd(rawAccount);

  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const { username, password, proxyId } = rawAccount;

  try {
    const result = await sequelize.transaction(async () => {
      const isAccExist = await Account.findOne({
        where: { username }
      });

      if (isAccExist) {
        return {
          type: 'error',
          message: 'Account already added in the system'
        };
      }

      if (proxyId) {
        const isProxyExist = await Proxy.findOne({
          where: { id: proxyId }
        });
        if (!isProxyExist) {
          return {
            type: 'error',
            message: `Proxy with ${proxyId} {id} not found`
          };
        }
      }

      const hashedPwd = encryptPassword(password);

      const newAccount = await Account.create({
        username,
        hashedPwd,
        userId,
        proxyId
      });

      const newAccountJson = newAccount.toJSON();

      delete newAccountJson.hashedPwd;

      const newAccountState = await AccountState.create({
        accountId: newAccount.id
      });

      const newAccountStats = await AccountStats.create({
        accountId: newAccount.id
      });

      return {
        type: 'success',
        data: {
          ...newAccountJson,
          state: newAccountState.toJSON(),
          accountStats: [newAccountStats.toJSON()]
        }
      };
    });

    if (result.type === 'error') {
      return res.status(400).json({ error: result.message });
    }

    return res.json(result.data);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: 'The database is currently unavailable.' });
  }
}

module.exports = createTwitterAccount;
