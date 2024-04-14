const { validateAccountAdd } = require('./addAcc');
const { validateAccountUpdate } = require('./updateAcc');
const { validateGetParams, createIncludeArray } = require('./getAcc');

module.exports = {
  validateAccountAdd,
  validateAccountUpdate,
  validateGetParams,
  createIncludeArray
};
