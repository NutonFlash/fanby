const sequelize = require("../../sequelize");
const bcrypt = require("bcrypt");
const User = require("../../models/User");
const { generateTokens } = require("./utils");

function validEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const match = email.match(regex);

  return match && match[0] === email;
}

const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 127;

function validPassword(password) {
  return (
    password.length >= MIN_PASSWORD_LENGTH &&
    password.length <= MAX_PASSWORD_LENGTH
  );
}

async function login(req, res) {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }
  if (!password) {
    return res.status(400).json({ error: "Password is required" });
  }
  if (!validEmail(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }
  if (!validPassword(password)) {
    return res.status(400).json({ error: "Invalid password format" });
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ error: "Couldn't find your account" });
    }

    const passwordMatch = bcrypt.compareSync(password, user.hashedPwd);

    if (!passwordMatch) {
      return res.status(403).json({ error: "Password is incorrect" });
    }

    const { accessToken, refreshToken } = generateTokens({
      id: user.id,
      email: user.email,
    });

    return res.json({ accessToken, refreshToken });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "The database is currently unavailable." });
  }
}

module.exports = login;
