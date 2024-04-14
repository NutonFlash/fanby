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

  const { priceAmount, actQty, orderDesc } = obj;

  if (!priceAmount) {
    return '{priceAmount} property is required';
  }
  if (!actQty) {
    return '{actQty} property is required';
  }
  if (!orderDesc) {
    return '{orderDesc} property is required';
  }

  return '';
}

const propTypeValidFnMap = {
  priceAmount: (val) => typeof val === 'number',
  actQty: (val) => typeof val === 'number' && Number.isInteger(val),
  orderDesc: (val) => typeof val === 'string'
};

const VAL_CONSTS = {
  MAX_ACT_QTY: 1000
};

const propValueValidFnMap = {
  priceAmount: (val) => {
    return val > 0;
  },
  actQty: (val) => {
    return val <= VAL_CONSTS.MAX_ACT_QTY && val > 0;
  },
  orderDesc: () => true
};

module.exports = {
  validateProps
};
