const Proxy = require('../../models/Proxy');
const { validateIdList } = require('../utils');

async function deleteProxies(req, res) {
  const userId = req.user.id;
  const { ids: idsStr } = req.query;

  const idsValidation = validateIdList(idsStr);

  if (idsValidation.type === 'error') {
    return res.status(400).json({ error: idsValidation.message });
  }

  const ids = idsValidation.data;

  try {
    await Proxy.destroy({
      where: { userId, id: ids }
    });

    return res.sendStatus(200);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: 'The database is currently unavailable.' });
  }
}

module.exports = deleteProxies;
