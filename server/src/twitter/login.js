const { By, Key, until } = require("selenium-webdriver");
const { login: loginSelectors } = require("./selectors");
const { webdriver } = require("./dependencies");

exports.login = async function login(username, password) {
  await webdriver.get("https://twitter.com/");
  await webdriver
    .wait(until.elementLocated(By.css(loginSelectors.loginButton)), 5000)
    .click();

  await webdriver
    .wait(until.elementLocated(By.css(loginSelectors.usernameInput), 5000))
    .sendKeys(username, Key.ENTER);
  await webdriver
    .wait(until.elementLocated(By.css(loginSelectors.passwordInput), 5000))
    .sendKeys(password, Key.ENTER);

  await webdriver.wait(until.urlIs("https://twitter.com/home"), 5000);
};
