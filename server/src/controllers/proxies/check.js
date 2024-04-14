const axios = require('axios');
const Proxy = require('../../models/Proxy');
const { getSocketByUserId } = require('../../wss');
const { validateIdList } = require('../utils');

async function getProxyInfo(proxy) {
  try {
    const start = Date.now();
    const axiosConfig = {
      proxy: {
        protocol: 'http',
        host: proxy.host,
        port: proxy.port,
        auth: {
          username: proxy.username,
          password: proxy.password
        }
      },
      timeout: 5000
    };

    await axios.get('https://www.google.com/', axiosConfig);

    const end = Date.now();
    const speed = end - start;

    let status = 'slow';
    if (speed < 5000) {
      status = 'medium';
    }
    if (speed < 1500) {
      status = 'fast';
    }

    return { status, speed };
  } catch (error) {
    return { status: 'invalid' };
  }
}

async function checkProxies(req, res) {
  const userId = req.user.id;
  const { ids: idsStr } = req.query;

  const idsValidation = validateIdList(idsStr);

  if (idsValidation.type === 'error') {
    return res.status(400).json({ error: idsValidation.message });
  }

  const ids = idsValidation.data;

  try {
    const proxies = await Proxy.findAll({
      where: { userId, id: ids }
    });

    const proxiesIds = proxies.map((proxy) => proxy.id);
    const notFoundIds = ids.filter((id) => !proxiesIds.includes(id));

    if (notFoundIds.length) {
      return res
        .status(404)
        .json({ error: `Proxies with [${notFoundIds}] id were not found` });
    }

    let progress = 0;

    const result = {
      fastProxies: {
        label: 'Fast proxies',
        ids: []
      },
      mediumProxies: { label: 'Medium proxies', ids: [] },
      slowProxies: { label: 'Slow proxies', ids: [] },
      notWorkingPorxies: { label: 'Not working proxies', ids: [] }
    };

    await Promise.all(
      proxies.map(async (proxy) => {
        const info = await getProxyInfo(proxy);

        progress += 100 / proxies.length;

        if (info.status === 'invalid') {
          result.notWorkingPorxies.ids.push(proxy.id);
        } else if (info.status === 'fast') {
          result.fastProxies.ids.push(proxy.id);
        } else if (info.status === 'medium') {
          result.mediumProxies.ids.push(proxy.id);
        } else {
          result.slowProxies.ids.push(proxy.id);
        }

        const socket = getSocketByUserId(userId);
        if (socket) {
          socket.send(
            JSON.stringify({
              type: 'proxy_info',
              data: { info, proxyId: proxy.id, progress }
            })
          );
        }
      })
    );

    return res.json(result);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: 'The database is currently unavailable.' });
  }
}

module.exports = checkProxies;
