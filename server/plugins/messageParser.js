const { By, until } = require("selenium-webdriver");
const { conversation, media } = require("../twitterStructure");
const { scrollIntoView, delay } = require("./utils");

let webdriver;
let logger;

exports.init = function init(options) {
	webdriver = options.webdriver;
	logger = options.logger;
};

/**
 * Parse specific number of messages from unique accounts within given conversation, skip own and anti-bot accounts messages
 * @param {Number} conversationId Id of conversation where to parse messages
 * @param {Number} messagesNumber Number of messages from unique accounts to parse
 * @returns {Map} Map, where key is Id of Selenium WebElement and value is object with such structure - {link: String, text: String, picture: String}
 */
exports.getMessages = async function getMessages(conversationId, messagesNumber) {
	await webdriver.get(`https://twitter.com/messages/${conversationId}`);

	// Get the div element which includes all messages of conversation
	const conversationContainer = await webdriver.wait(
		until.elementLocated(By.css(conversation.conversationContainer)),
		15000,
	);

	await delay(3000);

	const messages = [];
	const visitedMessages = new Set();

	// Get the total height of the entire message container, it updates when the user scrolls the conversation
	let totalHeight = 0;
	let heightRepeatCounter = 0;

	// Iterate through the visible conversation messages until collect the required number of messages, or scroll to the end of the conversation
	while (messages.length < messagesNumber && heightRepeatCounter < 5) {
		// Get all visible div elements which represent message entity
		const messageContainers = await webdriver.wait(
			until.elementsLocated(() => {
				return conversationContainer.findElements(By.css(conversation.messageContainer));
			}),
			5000,
		);

		const filteredMessages = [];
		for (message of messageContainers.reverse()) {
			const id = await message.getId();
			if (!visitedMessages.has(id)) {
				filteredMessages.push(message);
			}
		}

		// Iterate through visible messages from "bottom" to "up"
		// Break loop if got required number of messages or have checked all messages
		for (message of filteredMessages) {
			if (messages.length === messagesNumber) {
				break;
			}

			// await scrollIntoView(message);

			// document.querySelector('div[data-testid="DmActivityViewport"]').scrollTo()
			// Get WebElement Id
			const id = await message.getId();

			// Get a link to the account that sent the message
			let link = await getLinkFromMessage(message);

			// Go to the next message if there is no link to the user account
			// If messagesNumber is passed to the function, checks whether a message from a given user has already been added
			if (!link || messages.filter((curTweet) => curTweet.link === link).length > 0) {
				if (!visitedMessages.has(id)) {
					visitedMessages.add(id);
				}
				continue;
			}

			// Get text of message
			const text = await getTextFromMessage(message);
			// Try to get user link from text
			const userLinkFromText = getUserLinkFromText(text);
			// Set new value to link property
			if (userLinkFromText) link = userLinkFromText;

			// Get string of base-64 encoded picture
			const picture = await getPictureFromMessage(message);
			// Add message object to map
			messages.push({ link, text, picture });
		}

		await scrollIntoView(messageContainers.pop());

		// Update total height of the messages contaier after scrolling (it automatically increases triggered by user scroll)
		const { height: newTotalHeight } = await webdriver
			.findElement(By.css(conversation.conversationTotalHeightContainer))
			.getRect();

		if (totalHeight === newTotalHeight) {
			heightRepeatCounter++;
		}

		totalHeight = newTotalHeight;
	}

	return messages;
};

/**
 * Get the text, except emojies, from the given message
 * @param {WebElement} messageElement Message Node where to get the text
 * @returns {String} Text of the message
 */
async function getTextFromMessage(messageElement) {
	let text = "";
	try {
		// Find all spans in text section of the message
		spans = await messageElement.findElements(By.css(`${conversation.messageText} span`));
		for (span of spans) {
			try {
				// get text from each span
				const spanText = await span.getText();
				text += `${spanText} `;
			} catch (error) {}
		}
		// clean concatenated text
		text = text.trim().replace("\n", "").replace("\t", "").replace(/\s+/g, " ");
	} catch (error) {
		logger.error("Spans in message not found", {
			_module: "messageParser",
			_function: "getTextFromMessage",
		});
	}

	return text;
}

/**
 * Get user link from text
 * @param {String} text Text where to find user link
 * @returns {String|null} Link to user accounr or null
 */
function getUserLinkFromText(text) {
	const foundLinks = text.split(" ").filter((str) => str.match(/@.+/g));
	let link = "";
	if (foundLinks.length > 0) {
		link = foundLinks[0].replace("@", "");
	}
	return link ? `https://twitter.com/${link}` : null;
}

/**
 * Get the link of the user who sent given message
 * @param {WebElement} messageElement Message Node where to get the link
 * @returns {String} Link to the user account
 */
async function getLinkFromMessage(messageElement) {
	let link = "";
	try {
		const linkElement = await webdriver.wait(
			until.elementLocated(() => {
				return messageElement.findElement(By.css(`${conversation.conversationUserAvatar} a`));
			}),
			3000,
		);
		// Find the link of the user in message node and get the attribute href
		link = await linkElement.getAttribute("href");
	} catch (error) {
		logger.error("User link not found", {
			_module: "messageParser",
			_function: "getLinkFromMessage",
		});
	}

	return link;
}

/**
 * Get the string of base-64 encoded image from message
 * @param {WebElement} messageElement Message Node where to get the image
 * @returns {String} String of base-64 encoded image
 */
async function getPictureFromMessage(messageElement) {
	let imageBase64 = "";
	try {
		// Check if the message
		const compositMsg = await webdriver.wait(
			until.elementLocated(() => {
				return messageElement.findElement(By.css(conversation.compositeMessage));
			}),
			3000,
		);

		try {
			// Find image node and open it by click
			const image = await webdriver.wait(
				until.elementLocated(() => {
					return compositMsg.findElement(By.css(conversation.messagePicture));
				}),
				3000,
			);
			await image.click();
			// Find opened fullscreen image node
			const imageFullScreen = await webdriver.wait(
				until.elementLocated(By.css(`${media.imageFrame} img`), 5000),
			);
			// Make a screen shot of the image and get its base-64 encoded string
			imageBase64 = await imageFullScreen.takeScreenshot(true);
			// Find button to close fullscreen image and close it by click
			await webdriver.wait(until.elementLocated(By.css(media.closeButton), 5000)).click();
		} catch (error) {
			logger.error("Image in message not found", {
				_module: "messageParser",
				_function: "getPictureFromMessage",
			});
		}
	} catch (error) {
		logger.error("CompositeMessage not found", {
			_module: "messageParser",
			_function: "getPictureFromMessage",
		});
	}

	return imageBase64;
}
