const webdriver = require('../webdriver');
const logger = require('../logger');
const { plugins, initPlugins } = require('../twitter/index');

const { auth, messageParser, retweeter } = plugins;

exports.init = async function init(config) {
  const _webdriver = await webdriver.init(config.proxy);
  const _logger = logger.init();
  initPlugins({
    account: config.account,
    webdriver: _webdriver,
    logger: _logger
  });
};

exports.process = async function process(request) {
  await auth.login();
  let retweetCounter = 0;
  for (group of request.groups) {
    const messages = await messageParser.getMessages(
      group.id,
      group.messagesNumber
    );
    // console.log(messages);
    for (msg of messages) {
      await retweeter.retweetPinned(msg.link);
      retweetCounter++;
    }
  }
  console.log('maden retweets:', retweetCounter);
  // await retweeter.retweetOwn(request.own);
};

exports.destroy = function destroy() {
  webdriver.destroy();
  logger.destroy();
};
