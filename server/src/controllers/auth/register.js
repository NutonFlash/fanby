const bcrypt = require("bcrypt");
const User = require("../../models/User");
const { generateTokens } = require("./utils");

const saltRounds = 10;

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

async function register(req, res) {
  const { email, password, referalCode } = req.body;
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

  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPwd = bcrypt.hashSync(password, salt);

  try {
    const sameEmailUser = await User.findOne({ where: { email } });

    if (sameEmailUser) {
      return res.status(400).json({ error: "Email is already in use" });
    }

    const user = await User.create({
      email,
      hashedPwd,
      referalCode,
    });

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

module.exports = register;
