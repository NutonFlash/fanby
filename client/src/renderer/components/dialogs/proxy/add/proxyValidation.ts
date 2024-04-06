import { v4 as uuidv4 } from 'uuid';
import Proxy from '../../../../models/Proxy';

const ipv4Regex =
  '(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)';

const ipv6Regex =
  '([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^(([0-9a-fA-F]{1,4}:){6}|::([0-9a-fA-F]{1,4}:){0,5})[0-9a-fA-F]{1,4}$|^(([0-9a-fA-F]{1,4}:){5}(:[0-9a-fA-F]{1,4}){0,4}|::([0-9a-fA-F]{1,4}:){0,4}[0-9a-fA-F]{1,4})$|^(([0-9a-fA-F]{1,4}:){4}(:[0-9a-fA-F]{1,4}){0,5}|::([0-9a-fA-F]{1,4}:){0,3}[0-9a-fA-F]{1,4})$|^(([0-9a-fA-F]{1,4}:){3}(:[0-9a-fA-F]{1,4}){0,6}|::([0-9a-fA-F]{1,4}:){0,2}[0-9a-fA-F]{1,4})$|^(([0-9a-fA-F]{1,4}:){2}(:[0-9a-fA-F]{1,4}){0,7}|::[0-9a-fA-F]{1,4}|::)$|^([0-9a-fA-F]{1,4}:){1,7}:([0-9a-fA-F]{1,4}:){1,7}[0-9a-fA-F]{1,4}';

const hostnameRegex = '(?!-)[a-zA-Z0-9-]{1,63}(?<!-)(.[a-zA-Z0-9-]{1,63})*';

interface ProxyRegex {
  host: {
    ipv4: string;
    ipv6: string;
    domain: string;
  };
  port: string;
  user: string;
  pass: string;
}

const proxyRegex: ProxyRegex = {
  host: {
    ipv4: ipv4Regex,
    ipv6: ipv6Regex,
    domain: hostnameRegex,
  },
  port: '\\d{1,5}',
  user: '.+',
  pass: '.+',
};

export interface ProxyFormats {
  'host:port:user:pass': {
    regex: string;
  };
  'host:port@user:pass': {
    regex: string;
  };
  'user:pass:host:port': {
    regex: string;
  };
  'user:pass@host:port': {
    regex: string;
  };
  'host:port': {
    regex: string;
  };
}

export const proxyFormats: ProxyFormats = {
  'host:port:user:pass': {
    regex: '^(.*?):(.*?):(.*?):(.*?)$',
  },
  'host:port@user:pass': {
    regex: '^(.*?):(.*?)@(.*?):(.*?)$',
  },
  'user:pass:host:port': {
    regex: '^(.*?):(.*?):(.*?):(.*?)$',
  },
  'user:pass@host:port': {
    regex: '^(.*?):(.*?)@(.*?):(.*?)$',
  },
  'host:port': {
    regex: '^(.*?):(.*?)$',
  },
};

function isProxyHostCorrect(host: string) {
  return Object.entries(proxyRegex.host).some(([, regex]) => {
    const match = host.match(regex);
    return match && match[0] === host;
  });
}

function isProxyPortCorrect(port: string) {
  const regex = proxyRegex.port;
  const match = port.match(regex);
  if (match && match[0] === port) {
    if (Number.parseInt(port, 10) <= 65535) {
      return true;
    }
  }
  return false;
}

function isProxyUsernameCorrect(username: string) {
  const regex = proxyRegex.user;
  const match = username.match(regex);
  return match && match[0] === username;
}

function isProxyPasswordCorrect(password: string) {
  const regex = proxyRegex.pass;
  const match = password.match(regex);
  return match && match[0] === password;
}

function hasDuplicates(
  newProxies: Proxy[],
  addedProxies: Proxy[],
  proxies: Proxy[],
) {
  for (let i = 0; i < newProxies.length; i += 1) {
    if (
      proxies
        .map((proxy) => proxy.toString())
        .includes(newProxies[i].toString())
    ) {
      return `The proxy on line ${i + 1} is already added`;
    }
    if (
      addedProxies
        .map((proxy) => proxy.toString())
        .includes(newProxies[i].toString())
    ) {
      return `The proxy on line ${i + 1} is already added`;
    }
    if (
      newProxies.filter(
        (proxy) => proxy.toString() === newProxies[i].toString(),
      ).length > 1
    ) {
      return `The proxy on line ${i + 1} is duplicated`;
    }
  }
  return '';
}

export function validateProxies(
  proxiesInput: string,
  format: keyof ProxyFormats,
  addedProxies: Proxy[],
  proxies: Proxy[],
) {
  const proxiesInputProccessed = proxiesInput.trim();

  if (proxiesInputProccessed.length === 0) {
    return `Enter proxies`;
  }

  const proxiesStr = proxiesInputProccessed.split('\n');

  const { regex } = proxyFormats[format];

  const groups: string[] = [];
  format.split(/(:|@)/).forEach((prop) => {
    if (prop !== ':' && prop !== '@') {
      groups.push(prop);
    }
  });

  const newProxies: Proxy[] = [];

  for (let i = 0; i < proxiesStr.length; i += 1) {
    const proxy = proxiesStr[i];
    const match = proxy.match(regex);

    if (!match) {
      return `The proxy on line ${i + 1} has an invalid format`;
    }

    const host = match[groups.indexOf('host') + 1] || '';
    const port = match[groups.indexOf('port') + 1] || '';
    const username = match[groups.indexOf('user') + 1] || '';
    const password = match[groups.indexOf('pass') + 1] || '';

    if (!isProxyHostCorrect(host)) {
      return `The proxy on line ${i + 1} has an invalid host`;
    }
    if (!isProxyPortCorrect(port)) {
      return `The proxy on line ${i + 1} has an invalid port`;
    }

    if (format !== 'host:port') {
      if (!isProxyUsernameCorrect(username)) {
        return `The proxy on line ${i + 1} has an invalid username`;
      }
      if (!isProxyPasswordCorrect(password)) {
        return `The proxy on line ${i + 1} has an invalid password`;
      }
    }

    newProxies.push(
      new Proxy(
        uuidv4(),
        '',
        host,
        Number.parseInt(port, 10),
        username,
        password,
      ),
    );
  }

  return hasDuplicates(newProxies, addedProxies, proxies);
}
