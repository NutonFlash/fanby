const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { JWT_SECRET_KEY } = process.env;

function validateId(rawId) {
  if (!rawId) {
    return { type: 'error', message: "'id' param is required" };
  }

  const id = typeof rawId === 'string' ? parseInt(rawId, 10) : rawId;

  if (!Number.isInteger(id) || id < 0) {
    return { type: 'error', message: 'Invalid {id} format' };
  }

  return { type: 'success', data: id };
}

function validateIdList(idsStr) {
  if (!idsStr) {
    return { type: 'error', message: "'ids' query param is required" };
  }

  const idsStrArr = idsStr.split(',');

  const ids = [];

  for (let i = 0; i < idsStrArr.length; i += 1) {
    const parsedInt = parseInt(idsStrArr[i], 10);
    if (Number.isNaN(parsedInt)) {
      return {
        type: 'error',
        message: `Invalid format of ${i + 1} {id} in 'ids' query param`
      };
    }

    ids.push(parsedInt);
  }

  return { type: 'success', data: ids };
}

function authorizeToken(req, res, next) {
  const authHeader = req.get('Authorization');

  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header is required' });
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({
      error: "Authorization header must be in the format 'Bearer <token>'"
    });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    req.user = { id: decoded.id, email: decoded.email };
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

function encryptPassword(password) {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

function comparePasswords(password, hashedPwd) {
  return bcrypt.compareSync(password, hashedPwd);
}

module.exports = {
  validateId,
  validateIdList,
  authorizeToken,
  encryptPassword,
  comparePasswords
};
