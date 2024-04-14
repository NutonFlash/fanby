const Account = require('../../models/Account');
const { validateGetParams, createIncludeArray } = require('./utils');
const { validateId } = require('../utils');

async function getTwitterAccountById(req, res) {
  const userId = req.user.id;

  const { id: idStr } = req.params;

  const idValRes = validateId(idStr);

  if (idValRes.type === 'error') {
    return res.status(400).json({ error: idValRes.message });
  }

  const id = idValRes.data;

  const validationResult = validateGetParams(req.query);

  if (validationResult.type === 'error') {
    return res.status(400).json({ error: validationResult.message });
  }

  const include = createIncludeArray(validationResult.data);

  try {
    const account = await Account.findByPk(id, {
      where: { userId },
      include
    });

    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    const accountJson = account.toJSON();

    delete accountJson.hashedPwd;

    return res.json(accountJson);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: 'The database is currently unavailable.' });
  }
}

module.exports = getTwitterAccountById;
