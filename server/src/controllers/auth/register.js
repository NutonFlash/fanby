const User = require('../../models/User');
const { generateTokens, validateProps } = require('./utils');
const { encryptPassword } = require('./utils');

async function register(req, res) {
  const reqBody = req.body;

  const validationError = validateProps(reqBody, [
    'email',
    'password',
    'referalCode'
  ]);

  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const { email, password, referalCode } = reqBody;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }

  const hashedPwd = encryptPassword(password);

  try {
    const sameEmailUser = await User.findOne({ where: { email } });

    if (sameEmailUser) {
      return res.status(400).json({ error: 'Email is already in use' });
    }

    const user = await User.create({
      email,
      hashedPwd,
      referalCode
    });

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

module.exports = register;
