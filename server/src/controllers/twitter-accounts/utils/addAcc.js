const validateProps = require('./validation');

const accountAddProps = ['username', 'password', 'proxyId'];

function validateAccountAdd(rawAccount) {
  if (!rawAccount) {
    return 'No data provided';
  }

  if (Array.isArray(rawAccount)) {
    return 'Request body must be an object';
  }

  const validationError = validateProps(rawAccount, accountAddProps);

  if (validationError) {
    return validationError;
  }

  const { username, password } = rawAccount;

  if (!username) {
    return '{username} property is required';
  }
  if (!password) {
    return '{password} property is required';
  }

  return '';
}

module.exports = {
  validateAccountAdd
};
