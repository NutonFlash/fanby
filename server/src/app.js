const cors = require('cors');
const cookieParser = require('cookie-parser');
const express = require('express');
const apiRouter = require('./api');

let app;

function init() {
  app = express();
  app.use(
    cors({
      origin: true,
      credentials: true
    })
  );
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use('/api', apiRouter);

  return app;
}

function destroy() {
  app.close();
}

module.exports = {
  init,
  destroy
};
