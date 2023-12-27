const { Builder, Browser, Key, By, until } = require("selenium-webdriver");
require("dotenv").config();
const winston = require("winston");
const messageParser = require("./messageParser");
const utils = require("./utils");
const retwitter = require("./retwitter");

let driver;
let logger;

async function main() {
	driver = await new Builder().forBrowser(Browser.EDGE).build();
	logger = winston.createLogger({
		format: winston.format.combine(
			winston.format.timestamp(),
			winston.format.printf((info) =>
				JSON.stringify({
					date: utils.timeConverter(info.timestamp),
					level: info.level,
					message: info.message,
					module: info._module,
					function: info._function,
				}),
			),
		),
		transports: [
			new winston.transports.File({
				filename: "error.log ",
				level: "error",
				// handleExceptions: true,
				// handleRejections: true,
			}),
			new winston.transports.File({ filename: "app.log ", level: "info" }),
		],
		exitOnError: false,
	});

	if (process.env.NODE_ENV !== "production") {
		// logger.add(new winston.transports.Console());
	}

	// await driver.manage().window().maximize();
	await driver
		.manage()
		.window()
		.setRect({ width: 1920 / 2, height: 1080, x: 0, y: 0 });

	const username = "7Dropdrop";
	const password = "Sahalox2";

	utils.init(driver, logger);
	messageParser.init(driver, logger);
	retwitter.init(driver, logger, username);

	try {
		// ----------------- LOGIN -----------------

		await auth(username, password);
		// ----------------- SEND MESSAGE -----------------
		const conversationsID = [
			"1736485355375951879",
			"1727253401547800738",
			"1727247145315475579",
			"1733473821896646775",
			"1689120998371536896",
			"1677405653617332226",
			"1705246987254477126",
			"1730563812057895261",
		];

		for (id of conversationsID) {
			const nMessages = await messageParser.getMessages(id, 5);
			for (msg of nMessages.values()) {
				await retwitter.retweetPinned(msg.link);
			}
		}
		console.log(await retwitter.retweetMy(5));
		// await driver.get('https://twitter.com/messages' + '/' + conversationID);
		// let msgInput = await driver.wait(until.elementLocated(By.css('span[data-offset-key]')), 5000);
		// await msgInput.sendKeys('Вечер в хату, братва. Тестирую софт, не обращайте внимания на эти сообщения)', Key.ENTER);

		// ----------------- GET USERS -----------------
		// const nMessages = await messageParser.getMessages(conversationID);

		// for (msg of nMessages.values()) {
		// 	await retwitter.retweetPinned(msg.link);
		// }
		await retwitter.retweetMy(5);
	} finally {
		await driver.quit();
	}
}

async function auth(username, password, proxy) {
	await driver.get("https://twitter.com/");
	await driver.wait(until.elementLocated(By.css('a[href="/login"]')), 5000).click();

	await driver
		.wait(until.elementLocated(By.css('input[autocomplete="username"]'), 5000))
		.sendKeys(username, Key.ENTER);
	await driver
		.wait(until.elementLocated(By.css('input[autocomplete="current-password"]'), 5000))
		.sendKeys(password, Key.ENTER);

	await driver.wait(until.urlIs("https://twitter.com/home"), 5000);
}

main();
