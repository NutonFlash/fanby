const Proxy = require("../../models/Proxy");

async function addProxies(req, res) {
  const { proxies } = req.body;

  if (!proxies || proxies.length === 0) {
    return res.send(400).json({ error: "Proxies are required" });
  }

  if (!Array.isArray(proxies)) {
    return res.send(400).json({ error: "Proxies must be an array" });
  }

  try {
    const result = await Proxy.bulkCreate(
      proxies.map((proxy) => {
        // delete temporal id
        delete proxy.id;
        return proxy;
      })
    );
    res.json(result.map((proxy) => proxy.toJSON()));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "The database is currently unavailable." });
  }
}

module.exports = addProxies;
