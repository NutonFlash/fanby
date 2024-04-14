const ipv4Regex =
  '(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)';

const ipv6Regex =
  '([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^(([0-9a-fA-F]{1,4}:){6}|::([0-9a-fA-F]{1,4}:){0,5})[0-9a-fA-F]{1,4}$|^(([0-9a-fA-F]{1,4}:){5}(:[0-9a-fA-F]{1,4}){0,4}|::([0-9a-fA-F]{1,4}:){0,4}[0-9a-fA-F]{1,4})$|^(([0-9a-fA-F]{1,4}:){4}(:[0-9a-fA-F]{1,4}){0,5}|::([0-9a-fA-F]{1,4}:){0,3}[0-9a-fA-F]{1,4})$|^(([0-9a-fA-F]{1,4}:){3}(:[0-9a-fA-F]{1,4}){0,6}|::([0-9a-fA-F]{1,4}:){0,2}[0-9a-fA-F]{1,4})$|^(([0-9a-fA-F]{1,4}:){2}(:[0-9a-fA-F]{1,4}){0,7}|::[0-9a-fA-F]{1,4}|::)$|^([0-9a-fA-F]{1,4}:){1,7}:([0-9a-fA-F]{1,4}:){1,7}[0-9a-fA-F]{1,4}';

const hostnameRegex = '(?!-)[a-zA-Z0-9-]{1,63}(?<!-)(.[a-zA-Z0-9-]{1,63})*';

const proxyRegex = {
  host: {
    ipv4: ipv4Regex,
    ipv6: ipv6Regex,
    domain: hostnameRegex
  },
  port: '\\d{1,5}',
  user: '.+',
  pass: '.+'
};

function isProxyHostCorrect(host) {
  return Object.entries(proxyRegex.host).some(([, regex]) => {
    const match = host.match(regex);
    return match && match[0] === host;
  });
}

function isProxyPortCorrect(port) {
  if (port >= 0 && port <= 65535) {
    return true;
  }
  return false;
}

function hasDuplicates(proxies) {
  const unique = new Set(proxies.map((proxy) => JSON.stringify(proxy)));
  return unique.size < proxies.length;
}

const proxyProps = ['host', 'port', 'username', 'password'];

function validateProxyProps(rawProxy) {
  const rawProxyKeys = Object.keys(rawProxy);
  for (let i = 0; i < rawProxyKeys.length; i += 1) {
    if (!proxyProps.includes(rawProxyKeys[i])) {
      return rawProxyKeys[i];
    }
  }
  return '';
}

const proxyPropsTypeValFc = {
  host: (hostVal) => typeof hostVal === 'string',
  port: (portVal) => typeof portVal === 'number' && Number.isInteger(portVal),
  username: (usernameVal) => typeof usernameVal === 'string',
  password: (passwordVal) => typeof passwordVal === 'string'
};

function validateProxyPropsTypes(rawProxy) {
  const invalidKey = Object.keys(rawProxy).find(
    (key) => !proxyPropsTypeValFc[key](rawProxy[key])
  );
  return invalidKey || '';
}

function validateProxiesAdd(rawProxies) {
  if (!Array.isArray(rawProxies)) {
    return 'Request body must be an array of proxies';
  }

  for (let i = 0; i < rawProxies.length; i += 1) {
    const rawProxy = rawProxies[i];

    const invalidProp = validateProxyProps(rawProxy);

    if (invalidProp) {
      return `Invalid property {${invalidProp}} in the ${i + 1} proxy`;
    }

    const invalidType = validateProxyPropsTypes(rawProxy);

    if (invalidType) {
      return `Invalid type of {${invalidType}} property in the ${i + 1} proxy`;
    }

    const { host, port } = rawProxy;

    if (!host) {
      return `Missing {host} property in the ${i + 1} proxy`;
    }
    if (!port) {
      return `Missing {port} property in the ${i + 1} proxy`;
    }

    if (!isProxyHostCorrect(host)) {
      return `Invalif format of {host} property in the ${i + 1} proxy`;
    }
    if (!isProxyPortCorrect(port)) {
      return `Invalif format of {port} property in the ${i + 1} proxy`;
    }
  }

  return '';
}

function validateProxyUpdate(updateObj) {
  if (Array.isArray(updateObj)) {
    return 'Request body must be an object';
  }

  const invalidProp = validateProxyProps(updateObj);

  if (invalidProp) {
    return `Invalid property {${invalidProp}}`;
  }

  const invalidType = validateProxyPropsTypes(updateObj);

  if (invalidType) {
    return `Invalid type of {${invalidType}} property`;
  }

  const { host, port } = updateObj;

  if (host && !isProxyHostCorrect(host)) {
    return 'Invalif format of {host} property';
  }
  if (port && !isProxyPortCorrect(port)) {
    return 'Invalif format of {port} property';
  }

  return '';
}

function createUpdatedProxy(oldProxy, updateObj) {
  const updatedProxy = {};

  const keys = proxyProps;

  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    if (updateObj[key] !== undefined) {
      updatedProxy[key] = updateObj[key];
    } else {
      updatedProxy[key] = oldProxy[key];
    }
  }

  return updatedProxy;
}

module.exports = {
  validateProxiesAdd,
  validateProxyUpdate,
  createUpdatedProxy,
  hasDuplicates
};
