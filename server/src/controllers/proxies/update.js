const Proxy = require('../../models/Proxy');
const { validateId } = require('../utils');
const { validateProxyUpdate, createUpdatedProxy } = require('./utils');

async function updateProxy(req, res) {
  const userId = req.user.id;

  const { id: idStr } = req.params;

  const idValRes = validateId(idStr);

  if (idValRes.type === 'error') {
    return res.status(400).json({ error: idValRes.message });
  }

  const id = idValRes.data;

  const updateObj = req.body;

  const validationError = validateProxyUpdate(updateObj);

  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  if (!Object.keys(updateObj).length) {
    return res.status(400).json({ error: 'No valid fields to update' });
  }

  try {
    const oldProxy = await Proxy.findOne({ where: { id, userId } });

    if (!oldProxy) {
      return res.status(404).json({ error: 'Updating proxy not found' });
    }

    const updatedProxy = createUpdatedProxy(oldProxy, updateObj);

    const addedProxies = await Proxy.findAll({
      where: {
        userId,
        ...updatedProxy
      }
    });

    if (addedProxies.length) {
      return res.status(400).json({
        error: "Update can't be completed as the result proxy is already added"
      });
    }

    await Proxy.update(updateObj, { where: { id, userId } });

    return res.sendStatus(200);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: 'The database is currently unavailable.' });
  }
}

module.exports = updateProxy;
