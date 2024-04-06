const sequelize = require("../../sequelize");
const User = require("../../models/User");

async function fetchUser(req, res) {
  const userId = req.user.id;

  try {
    const result = await sequelize.transaction(async (t) => {
      const user = await User.findByPk(userId);
      return user.toJSON();
    });
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "The database is currently unavailable." });
  }
}

module.exports = fetchUser;
