const Proxy = require('../../models/Proxy');

async function getAllProxies(req, res) {
  const userId = req.user.id;

  try {
    const proxies = await Proxy.findAll({
      where: { userId }
    });

    return res.json(proxies.map((proxy) => proxy.toJSON()));
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: 'The database is currently unavailable.' });
  }
}

module.exports = getAllProxies;
