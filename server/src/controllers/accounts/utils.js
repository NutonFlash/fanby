const MIN_USERNAME_LENGTH = 5;
const MAX_USERNAME_LENGTH = 15;

function validUsername(newUsername) {
  const match = newUsername.match(/[A-Za-z0-9_]+/);
  if (newUsername.length < MIN_USERNAME_LENGTH) {
    return false;
  }
  if (newUsername.length > MAX_USERNAME_LENGTH) {
    return false;
  }
  if (!match || match[0] !== newUsername) {
    return false;
  }
  if (newUsername.match(`[0-9]{${newUsername.length}}`)) {
    return false;
  }
  return true;
}

const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 127;

function validPassword(newPassword) {
  if (newPassword.length < MIN_PASSWORD_LENGTH) {
    return false;
  }
  if (newPassword.length > MAX_PASSWORD_LENGTH) {
    return false;
  }
  return true;
}

module.exports = {
  validUsername,
  validPassword,
};
