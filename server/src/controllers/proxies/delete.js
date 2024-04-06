const Proxy = require("../../models/Proxy");

async function deleteProxies(req, res) {
  const userId = req.user.id;
  const { ids } = req.query;

  if (!ids) {
    return res.status(400).send("Ids query is required");
  }

  const idsToDelete = ids.split(",");

  try {
    await Proxy.destroy({
      where: { userId, id: idsToDelete },
    });
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "The database is currently unavailable." });
  }
}

module.exports = deleteProxies;
