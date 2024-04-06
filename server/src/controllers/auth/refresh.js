const jwt = require("jsonwebtoken");
const { generateTokens } = require("./utils");

const JWT_REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET_KEY;

async function refresh(req, res) {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ error: "Refresh token is required" });
  }

  try {
    const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET_KEY);
    const tokens = generateTokens({id: payload.id, email: payload.email});
    res.json(tokens);
  } catch (error) {
    return res.status(401).json({ error: "Invalid refresh token" });
  }
}

module.exports = refresh;
