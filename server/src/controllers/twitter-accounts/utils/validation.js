function validateProps(obj, props) {
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

const typeValidMap = {
  string: (val) => typeof val === 'string',
  integer: (val) => typeof val === 'number' && Number.isInteger(val),
  boolean: (val) => typeof val === 'boolean'
};

const propTypeValidFnMap = {
  username: typeValidMap.string,
  password: typeValidMap.string,
  proxyId: typeValidMap.integer,
  avatar: typeValidMap.string,
  followers: typeValidMap.integer,
  posts: typeValidMap.integer,
  groupNumber: typeValidMap.integer,
  activityTotal: typeValidMap.integer,
  retweetsTotal: typeValidMap.integer,
  messagesTotal: typeValidMap.integer,
  isActivated: typeValidMap.boolean,
  expirationDate: typeValidMap.string
};

const VAL_CONSTS = {
  MIN_USER_LEN: 5,
  MAX_USER_LEN: 15,
  USER_REGEX: (usernameLen) => `^(?!\\d+$)[A-Za-z0-9_]{${usernameLen}}$`,
  MIN_PASS_LEN: 8,
  MAX_PASS_LEN: 127,
  EXP_DATE_REGEX: /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/
};

const propValueValidFnMap = {
  username: (val) => {
    if (
      val.length < VAL_CONSTS.MIN_USER_LEN ||
      val.length > VAL_CONSTS.MAX_USER_LEN
    ) {
      return false;
    }
    const match = val.match(VAL_CONSTS.USER_REGEX(val.length));
    if (!match || match[0] !== val) {
      return false;
    }
    return true;
  },
  password: (val) => {
    return (
      val.length < VAL_CONSTS.MAX_PASS_LEN &&
      val.length > VAL_CONSTS.MIN_PASS_LEN
    );
  },
  proxyId: (val) => val >= 1,
  avatar: () => true,
  followers: (val) => val >= 0,
  posts: (val) => val >= 0,
  groupNumber: (val) => val >= 0,
  activityTotal: (val) => val >= 0,
  retweetsTotal: (val) => val >= 0,
  messagesTotal: (val) => val >= 0,
  isActivated: () => true,
  expirationDate: (val) => {
    const regex = VAL_CONSTS.EXP_DATE_REGEX;
    if (!regex.test(val)) {
      return false;
    }

    const date = new Date(val);
    if (Number.isNaN(date.getTime())) {
      return false;
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    return formattedDate === val;
  }
};

module.exports = validateProps;
