const Account = require('../../models/Account');
const Proxy = require('../../models/Proxy');
const { validateId } = require('../utils');
const { validateAccountUpdate } = require('./utils');
const { encryptPassword } = require('../utils');

async function updateTwitterAccountById(req, res) {
  const userId = req.user.id;

  const { id: idStr } = req.params;

  const idValRes = validateId(idStr);

  if (idValRes.type === 'error') {
    return res.status(400).json({ error: idValRes.message });
  }

  const id = idValRes.data;

  const updateObj = req.body;

  const validationError = validateAccountUpdate(updateObj);

  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  if (!Object.keys(updateObj).length) {
    return res.status(400).json({ error: 'No valid fields to update' });
  }

  try {
    if (updateObj.proxyId) {
      const foundProxy = await Proxy.findByPk(updateObj.proxyId, {
        where: { userId }
      });

      if (!foundProxy) {
        return res
          .status(404)
          .json({ error: `Proxy with ${updateObj.proxyId} {id} not found` });
      }
    }

    if (updateObj.password) {
      updateObj.hashedPwd = encryptPassword(updateObj.password);
      delete updateObj.password;
    }

    await Account.update(updateObj, { where: { id, userId } });

    return res.sendStatus(200);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: 'The database is currently unavailable.' });
  }
}

module.exports = updateTwitterAccountById;
