const jwt = require('jsonwebtoken');

const { JWT_SECRET_KEY } = process.env;
const { JWT_REFRESH_SECRET_KEY } = process.env;

function generateTokens(payload) {
  const accessToken = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '15m' });
  const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET_KEY, {
    expiresIn: '14d'
  });
  return { accessToken, refreshToken };
}

function validateProps(obj, props) {
  if (!obj) {
    return 'No data provided';
  }

  if (Array.isArray(obj)) {
    return 'Request body must be an object';
  }

  const objKeys = Object.keys(obj);

  for (let i = 0; i < objKeys.length; i += 1) {
    const key = objKeys[i];

    if (!props.includes(key)) {
      return `Invalid {${key}} property`;
    }

    if (!propTypeValidFnMap[key](obj[key])) {
      return `Invalid type of {${key}} property`;
    }

    if (!propValueValidFnMap[key](obj[key])) {
      return `Invalid format of {${key}} property`;
    }
  }

  return '';
}

const propTypeValidFnMap = {
  email: (val) => typeof val === 'string',
  password: (val) => typeof val === 'string',
  referalCode: (val) => typeof val === 'string',
  refreshToken: (val) => typeof val === 'string'
};

const VAL_CONSTS = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  MIN_PASS_LEN: 8,
  MAX_PASS_LEN: 127
};

const propValueValidFnMap = {
  email: (val) => {
    const match = val.match(VAL_CONSTS.EMAIL_REGEX);
    return match && match[0] === val;
  },
  password: (val) => {
    return (
      val.length <= VAL_CONSTS.MAX_PASS_LEN &&
      val.length >= VAL_CONSTS.MIN_PASS_LEN
    );
  },
  referalCode: () => true,
  refreshToken: () => true
};

module.exports = {
  generateTokens,
  validateProps
};
