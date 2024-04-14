const Group = require('../../../models/Group');
const AccountState = require('../../../models/AccountState');
const AccountStats = require('../../../models/AccountStats');
const JoinAccountGroup = require('../../../models/JoinAccountGroup');
const AccountGroupStats = require('../../../models/AccountGroupStats');

function isValidDateFormat(dateString) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) {
    return false;
  }

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return false;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  const formattedDate = `${year}-${month}-${day}`;

  return formattedDate === dateString;
}

function validateBooleanParam(param, paramName) {
  if (param !== 'true' && param !== 'false') {
    return { type: 'error', message: `Invalid value for '${paramName}' param` };
  }
  return { type: 'success', data: param === 'true' };
}

function validateDateParam(dateParam, paramName) {
  const [startDateStr, endDateStr] = dateParam
    .split(',', 2)
    .map((dateStr) => dateStr.trim());

  if (startDateStr && endDateStr) {
    if (!isValidDateFormat(startDateStr)) {
      return {
        type: 'error',
        message: `Invalid format of {startDate} in '${paramName}' param`
      };
    }
    if (!isValidDateFormat(endDateStr)) {
      return {
        type: 'error',
        message: `Invalid format of {endDate} in '${paramName}' param`
      };
    }

    const startDateTimeStr = `${startDateStr} : 00:00:00`;
    const endDateTimeStr = `${endDateStr} 23:59:59`;

    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    if (endDate > new Date()) {
      return {
        type: 'error',
        message: `{endDate} in '${paramName}' param cannot be in the future`
      };
    }
    if (startDate > endDate) {
      return {
        type: 'error',
        message: `{startDate} in '${paramName}' param cannot be after {endDate}`
      };
    }

    return { type: 'success', data: [startDateTimeStr, endDateTimeStr] };
  }

  if (startDateStr) {
    if (!isValidDateFormat(startDateStr)) {
      return {
        type: 'error',
        message: `Invalid format of {date} in '${paramName}' param`
      };
    }

    const startDateTimeStr = `${startDateStr} : 00:00:00`;
    const endDateTimeStr = `${startDateStr} 23:59:59`;

    const date = new Date(startDateStr);

    if (date > new Date()) {
      return {
        type: 'error',
        message: `{date} in '${paramName}' param cannot be in the future`
      };
    }

    return { type: 'success', data: [startDateTimeStr, endDateTimeStr] };
  }

  return {
    type: 'error',
    message: `Invalid format of {date} in '${paramName}' param`
  };
}

function validateGetParams(params) {
  const {
    includeState,
    includeAccountStats,
    includeGroups,
    includeAccountGroupStats
  } = params;

  const result = {
    type: 'success',
    data: {}
  };

  if (includeState) {
    const validationResult = validateBooleanParam(includeState, 'includeState');

    if (validationResult.type === 'error') {
      return validationResult;
    }

    result.data.includeState = validationResult.data;
  }

  if (includeAccountStats) {
    const validationResult = validateDateParam(
      includeAccountStats,
      'includeAccountStats'
    );

    if (validationResult.type === 'error') {
      return validationResult;
    }

    result.data.includeAccountStats = validationResult.data;
  }

  if (includeGroups) {
    const validationResult = validateBooleanParam(
      includeGroups,
      'includeGroups'
    );

    if (validationResult.type === 'error') {
      return validationResult;
    }

    result.data.includeGroups = validationResult.data;
  }

  if (includeAccountGroupStats) {
    const validationResult = validateDateParam(
      includeAccountGroupStats,
      'includeAccountGroupStats'
    );

    if (validationResult.type === 'error') {
      return validationResult;
    }

    result.data.includeAccountGroupStats = validationResult.data;
  }

  return result;
}

function createIncludeArray(proccesedParams) {
  const {
    includeState,
    includeAccountStats,
    includeGroups,
    includeAccountGroupStats
  } = proccesedParams;

  const include = [];

  if (includeState) {
    include.push({ model: AccountState, as: 'state' });
  }

  if (includeAccountStats) {
    const [startDate, endDate] = includeAccountStats;
    include.push({
      model: AccountStats,
      as: 'accountStats',
      where: { createdAt: { $between: [startDate, endDate] } }
    });
  }

  if (includeGroups || includeAccountGroupStats) {
    const joinInclude = {
      model: JoinAccountGroup,
      as: 'joinAccountGroups',
      include: []
    };

    if (includeGroups) {
      joinInclude.include.push({ model: Group, as: 'group' });
    }

    if (includeAccountGroupStats) {
      const [startDate, endDate] = includeAccountGroupStats;
      joinInclude.include.push({
        model: AccountGroupStats,
        as: 'accountGroupStats',
        where: { createdAt: { $between: [startDate, endDate] } }
      });
    }

    include.push(joinInclude);
  }

  return include;
}

module.exports = {
  validateGetParams,
  createIncludeArray
};
