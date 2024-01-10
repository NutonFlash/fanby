const { By, Key, until } = require("selenium-webdriver");
const { login: loginSelectors } = require("../twitterStructure");

let webdriver;
let logger;
let username;
let password;

exports.init = function init(options) {
	webdriver = options.webdriver;
	logger = options.logger;
	({ username, password } = options.account);
};

exports.login = async function login() {
	await webdriver.get("https://twitter.com/");
	await webdriver.wait(until.elementLocated(By.css(loginSelectors.loginButton)), 5000).click();

	await webdriver
		.wait(until.elementLocated(By.css(loginSelectors.usernameInput), 5000))
		.sendKeys(username, Key.ENTER);
	await webdriver
		.wait(until.elementLocated(By.css(loginSelectors.passwordInput), 5000))
		.sendKeys(password, Key.ENTER);

	await webdriver.wait(until.urlIs("https://twitter.com/home"), 5000);
};
