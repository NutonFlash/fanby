const Account = require('../../models/Account');
const { validateGetParams, createIncludeArray } = require('./utils');

async function getAllTwitterAccounts(req, res) {
  const userId = req.user.id;

  const validationResult = validateGetParams(req.query);

  if (validationResult.type === 'error') {
    return res.status(400).json({ error: validationResult.message });
  }

  const include = createIncludeArray(validationResult.data);

  try {
    const accounts = await Account.findAll({
      where: { userId },
      include
    });

    const accountsJson = accounts.map((account) => {
      const accJson = account.toJSON();
      delete accJson.hashedPwd;
      return accJson;
    });

    return res.json(accountsJson);
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'The database is currently unavailable.' });
  }
}

module.exports = getAllTwitterAccounts;
