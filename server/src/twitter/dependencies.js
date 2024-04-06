const loggerModule = require("../logger/index");
const webdriverModule = require("../webdriver/index");

module.exports = {
  logger: loggerModule.logger,
  webdriver: webdriverModule.driver,
};
