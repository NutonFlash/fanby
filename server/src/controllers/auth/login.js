const User = require('../../models/User');
const { generateTokens, validateProps } = require('./utils');
const { comparePasswords } = require('./utils');

async function login(req, res) {
  const reqBody = req.body;

  const validationError = validateProps(reqBody, ['email', 'password']);

  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const { email, password } = reqBody;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ error: "Couldn't find your account" });
    }

    const passwordMatch = comparePasswords(password, user.hashedPwd);

    if (!passwordMatch) {
      return res.status(403).json({ error: 'Password is incorrect' });
    }

    const { accessToken, refreshToken } = generateTokens({
      id: user.id,
      email: user.email
    });

    return res.json({ accessToken, refreshToken });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: 'The database is currently unavailable.' });
  }
}

module.exports = login;
