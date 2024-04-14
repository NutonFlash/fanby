const { Op } = require('sequelize');
const Proxy = require('../../models/Proxy');
const { validateAddProxies, hasDuplicates } = require('./utils');

async function createProxies(req, res) {
  const userId = req.user.id;

  const rawProxies = req.body;

  const validationError = validateAddProxies(rawProxies);

  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const proxies = rawProxies.map((rawProxy) => {
    return { userId, ...rawProxy };
  });

  if (hasDuplicates(proxies)) {
    return res.status(400).json({ error: 'Array contains duplicated proxy' });
  }

  try {
    const addedProxies = await Proxy.findAll({
      where: {
        [Op.or]: proxies.map(({ host, port, username, password }) => {
          return {
            [Op.and]: [
              { userId },
              { host },
              { port },
              { username: username || '' },
              { password: password || '' }
            ]
          };
        })
      }
    });

    if (addedProxies.length) {
      return res
        .status(400)
        .json({ error: 'Array contains proxy that is already added' });
    }

    const createdProxies = await Proxy.bulkCreate(proxies);

    return res.json(createdProxies.map((proxy) => proxy.toJSON()));
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: 'The database is currently unavailable.' });
  }
}

module.exports = createProxies;
