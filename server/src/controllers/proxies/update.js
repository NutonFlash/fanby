const Proxy = require("../../models/Proxy");

async function updateProxy(req, res) {
  const userId = req.user.id;

  try {
    await Proxy.update(
      { ...req.body },
      { where: { userId, id: req.params.id } }
    );

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "The database is currently unavailable." });
  }
}

module.exports = updateProxy;
