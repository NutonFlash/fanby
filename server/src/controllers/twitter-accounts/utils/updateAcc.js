const validateProps = require('./validation');

const accountUpdateProps = [
  'password',
  'proxyId',
  'avatar',
  'followers',
  'posts',
  'groupNumber',
  'activityTotal',
  'retweetsTotal',
  'messagesTotal',
  'isActivated',
  'expirationDate'
];

function validateAccountUpdate(updateObj) {
  if (!updateObj) {
    return 'No data provided';
  }

  if (Array.isArray(updateObj)) {
    return 'Request body must be an object';
  }

  const validationError = validateProps(updateObj, accountUpdateProps);

  if (validationError) {
    return validationError;
  }

  return '';
}

module.exports = {
  validateAccountUpdate
};
