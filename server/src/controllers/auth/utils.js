const jwt = require("jsonwebtoken");

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const JWT_REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET_KEY;

function generateTokens(payload) {
  const accessToken = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: "15m" });
  const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET_KEY, {
    expiresIn: "14d",
  });
  return { accessToken, refreshToken };
}

function authorizeToken(req, res, next) {
  const authHeader = req.get("Authorization");

  if (!authHeader) {
    return res
      .status(401)
      .json({ error: "Authorization header is required" });
  }

  const parts = authHeader.split(" ");

  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({
      error:
        "Authorization header must be in the format 'Bearer <token>'",
    });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    req.user = { id: decoded.id, email: decoded.email };
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

module.exports = {
  authorizeToken,
  generateTokens,
};
