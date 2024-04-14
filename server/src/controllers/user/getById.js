const User = require('../../models/User');

async function getUserById(req, res) {
  const userId = req.user.id;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userJson = user.toJSON();

    delete userJson.hashedPwd;

    return userJson;
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: 'The database is currently unavailable.' });
  }
}

module.exports = getUserById;
