const Proxy = require("../../models/Proxy");

async function fetchAllProxies(req, res) {
  const userId = req.user.id;

  try {
    const proxies = await Proxy.findAll({
      where: { userId },
    });
    res.json(proxies.map((proxy) => proxy.toJSON()));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "The database is currently unavailable." });
  }
}

module.exports = fetchAllProxies;
