const jwt = require('jsonwebtoken');
const { generateTokens, validateProps } = require('./utils');

const { JWT_REFRESH_SECRET_KEY } = process.env;

async function refresh(req, res) {
  const reqBody = req.body;

  const validationError = validateProps(reqBody, ['refreshToken']);

  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const { refreshToken } = reqBody;

  if (!refreshToken) {
    return res.status(400).json({ error: 'Refresh token is required' });
  }

  try {
    const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET_KEY);
    const tokens = generateTokens({ id: payload.id, email: payload.email });

    return res.json(tokens);
  } catch (error) {
    return res.status(401).json({ error: 'Invalid refresh token' });
  }
}

module.exports = refresh;
