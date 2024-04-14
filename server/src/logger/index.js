const winston = require('winston');
const utils = require('../twitter/utils');

let logger;

function init() {
  logger = winston.createLogger({
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.printf((info) =>
        JSON.stringify({
          date: utils.timeConverter(info.timestamp),
          level: info.level,
          message: info.message,
          module: info._module,
          function: info._function
        })
      )
    ),
    transports: [
      new winston.transports.File({
        filename: 'error.log ',
        level: 'error'
        // handleExceptions: true,
        // handleRejections: true,
      }),
      new winston.transports.File({ filename: 'app.log ', level: 'info' })
    ],
    exitOnError: false
  });

  return logger;
}

function destroy() {
  logger.close();
}

module.exports = {
  init,
  destroy,
  logger
};
