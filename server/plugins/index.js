const retweeter = require("./retweeter");
const messageParser = require("./messageParser");
const auth = require("./auth");
const utils = require("./utils");

const plugins = { auth, retweeter, messageParser, utils };

exports.initPlugins = function initPlugins(options) {
	for (const name in plugins) {
		plugins[name].init(options);
	}
};

exports.plugins = plugins;
