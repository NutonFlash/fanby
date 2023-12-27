const { dialog } = require("./twitterStructure");
const { By } = require("selenium-webdriver");

const selectors = dialog.selectors;

let driver;
let logger;

exports.init = (_driver, _logger) => {
	driver = _driver;
	logger = _logger;
};

/**
 * Convert timestamp to yyyy/mm/dd hh/mm:ss format
 * @param {Number} timestamp Timestamp to convert
 * @returns {String} Formatted string
 */
exports.timeConverter = function timeConverter(timestamp) {
	const dateObj = new Date(timestamp);
	const timeObj = {
		year: dateObj.getFullYear(),
		month: dateObj.getMonth() + 1,
		date: dateObj.getDate(),
		hour: dateObj.getHours(),
		min: dateObj.getMinutes(),
		sec: dateObj.getSeconds(),
	};
	for (prop in timeObj) {
		// If value is single digit, add leading 0
		if (timeObj[prop].toString().length < 2) timeObj[prop] = `0${timeObj[prop]}`;
	}
	return `${timeObj.year}/${timeObj.month}/${timeObj.date} ${timeObj.hour}:${timeObj.min}:${timeObj.sec}`;
};

/**
 * Scroll element by executing script in DevTool console
 * @param {String} elementSelector Selector to find DOM node
 * @param {String} direction Scrolling direction (up/down)
 * @param {Number} _height Height to scroll
 */
exports.scrollBy = async function scrollBy(elementSelector, direction, _height) {
	// Mirror the height if scroll direction is up
	const height = direction === "up" ? -_height : _height;
	// Execute scrolling with JS statement
	try {
		await driver.executeScript(
			`document.querySelector('${elementSelector}').scrollBy(0, ${height});`,
		);
	} catch (error) {
		logger.error(`Failed to scroll element with '${elementSelector}' css selector`, {
			_module: "utils",
			_function: "scrollBy",
		});
	}
};

exports.scrollTo = async function scrollTo(elementSelector, x, y) {
	try {
		await driver.executeScript(
			`document.querySelector('${elementSelector}').scrollTo(${x}, ${y});`,
		);
	} catch (error) {
		logger.error(`Failed to scroll element with '${elementSelector}' css selector`, {
			_module: "utils",
			_function: "scrollTo",
		});
	}
};

exports.scrollIntoView = async function scrollIntoView(element) {
	try {
		await driver.executeScript("arguments[0].scrollIntoView();", element);
	} catch (error) {
		logger.error("Failed to scroll element into view", {
			_module: "utils",
			_function: "scrollIntoView",
		});
	}
};

exports.closeDialog = async function closeDialog() {
	try {
		const dialogContainer = await driver.findElement(By.css(selectors.dialogContainer));
		await dialogContainer.findElement(By.css(selectors.closeButton)).click();
	} catch (error) {
		logger.error("Failed to close dialog window", {
			_module: "utils",
			_function: "closeDialog",
		});
	}
};

exports.delay = function delay(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
};
