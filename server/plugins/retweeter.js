const { By, until } = require("selenium-webdriver");
const { profile, media: mediaSelectors } = require("../twitterStructure");
const { closeDialog, delay, scrollIntoView, isClickable } = require("./utils");
const { Driver } = require("selenium-webdriver/chrome");

let webdriver;
let logger;
let username;

exports.init = function init(options) {
	webdriver = options.webdriver;
	logger = options.logger;
	({ username } = options.account);
};

/**
 * Retweet pinned tweet from the user page
 * @param {String} userLink Link to the user page
 */
exports.retweetPinned = async function retweetPinned(userLink) {
	// Go to the user page
	await webdriver.get(userLink);
	// Get first tweet from the page (usually pinned)
	const tweet = await webdriver.wait(until.elementLocated(By.css(profile.tweet)), 15000);

	// Make the retweet
	if (await isRetweeted(tweet)) {
		await unretweet(tweet);
	}
	await retweet(tweet);
};

exports.retweetOwn = async function retweetOwn(retweetNumber) {
	await webdriver.get(`https://twitter.com/${username}/media`);
	const container = await webdriver.wait(until.elementLocated(By.css("main section")), 15000);

	const retweetedMedia = new Set();
	let retweetCounter = 0;
	const mediasNumber = await getNumberFromFeedHeader();

	const testIdList = [];

	while (retweetedMedia.size < mediasNumber) {
		const mediaContainers = await webdriver.wait(
			until.elementsLocated(() => {
				return container.findElements(By.css(`${mediaSelectors.mediaContainer} a`));
			}),
			5000,
		);
		const filteredMedias = [];
		for (media of mediaContainers) {
			const id = await getTweetIdFromMedia(media);
			if (!retweetedMedia.has(id)) {
				filteredMedias.push(media);
			}
		}
		for (media of filteredMedias) {
			const id = await getTweetIdFromMedia(media);

			await media.click();

			await webdriver.wait(until.elementLocated(By.css(mediaSelectors.imageFrame)), 5000);

			if (await isRetweeted()) {
				await unretweet();
				await retweet();
			} else {
				await retweet();
			}

			retweetCounter++;

			testIdList.push(id);

			retweetedMedia.add(id);

			const closeButton = await webdriver.wait(
				until.elementLocated(By.css(mediaSelectors.closeButton)),
				5000,
			);
			await webdriver.wait(isClickable(closeButton), 3000);
			await closeButton.click();

			if (retweetCounter === retweetNumber) {
				return retweetCounter;
			}
		}
		await scrollIntoView(mediaContainers.pop());
	}

	return retweetCounter;
};

/**
 * Determine whether tweet is retweeted or not
 * @param {WebElement} tweet Tweet to determine
 * @returns {Boolean} Return true or false
 */
async function isRetweeted(tweet = webdriver) {
	let isRetweeted = false;
	try {
		await webdriver.wait(
			until.elementLocated(() => {
				return tweet.findElement(By.css(profile.retweetButton));
			}),
			3000,
		);
	} catch (error) {
		isRetweeted = true;
	}
	return isRetweeted;
}

/**
 * Retweet given tweet
 * @param {WebElement} tweet Tweet to retweet
 */
async function retweet(tweet = webdriver) {
	try {
		await closeDialog();
		// Get retweet button
		const retweetButton = await webdriver.wait(
			until.elementLocated(() => {
				return tweet.findElement(By.css(profile.retweetButton));
			}),
			3000,
		);
		// Click retweet button to open actions menu
		await retweetButton.click();

		await closeDialog();
		// Get retweet confirm button
		const retweetConfirmButton = await webdriver.wait(
			until.elementLocated(By.css(profile.retweetConfirmButton)),
			3000,
		);
		// Click retweet confirm button to retweet
		await retweetConfirmButton.click();
	} catch (error) {
		logger.error("Failed to retweet", {
			_module: "retwitter",
			_function: "retweet",
		});
	}
}

/**
 * Unretweet given tweet
 * @param {WebElement} tweet Tweet to unretweet
 */
async function unretweet(tweet = webdriver) {
	try {
		await closeDialog();
		// Get unretweet button
		const unretweetButton = await webdriver.wait(
			until.elementLocated(() => {
				return tweet.findElement(By.css(profile.unretweetButton));
			}),
			3000,
		);
		// Click unretweet button to open actions menu
		await unretweetButton.click();

		await closeDialog();
		// Get unretweet confirm button
		const unretweetConfirmButton = await webdriver.wait(
			until.elementLocated(By.css(profile.unretweetConfirmButton)),
			3000,
		);
		// Click unretweet confirm button to unretweet
		await unretweetConfirmButton.click();
	} catch (error) {
		logger.error("Failed to unretweet", {
			_module: "retwitter",
			_function: "unretweet",
		});
	}
}

/**
 * Determine whether that tweet is mine or not
 * @param {WebElement} tweet Tweet to determine
 * @returns {Boolean} Return true or false
 */
async function isMyTweet(tweet) {
	// Get the username of the tweet owner
	const usernameFromTweet = await getUsername(tweet);
	// Compare it with my username
	return usernameFromTweet === username;
}

/**
 * Determine whether that tweet is pinned or not
 * @param {WebElement} tweet Tweet where to find pin element
 * @returns {Boolean} Return true or false
 */
async function isPinnedTweet(tweet) {
	let isPinnedTweet = false;
	try {
		await webdriver.wait(
			until.elementLocated(() => {
				return tweet.findElement(By.css(profile.pinContainer));
			}),
			3000,
		);
		// If pin element was found it is pinned tweet
		isPinnedTweet = true;
	} catch (error) {
		logger.error("Failed to find pin element", {
			_module: "retwitter",
			_function: "isPinnedTweet",
		});
	}
	return isPinnedTweet;
}

/**
 * Get the tweet Id from a link to its page
 * @param {WebElement} tweet Tweet where to look for the link
 * @returns {String} Id or empty string if the link wasn't found
 */
async function getTweetIdFromMedia(media) {
	let id = ""; // Expected that link to each post looks like this: 'https://twitter.com/{username}/status/123213132341432'
	const regex = /\/status\/(\d+)/;
	try {
		// Get the link value
		const idLink = await media.getAttribute("href");
		id = idLink.match(regex);
		// If id was found the length shoud be 2 (0: matching part, 1: captured group)
		if (id?.length === 2) {
			id = id[1];
		} else {
			id = "";
		}
	} catch (error) {
		logger.error("Failed to find tweet Id", {
			_module: "retwitter",
			_function: "getTweetId",
		});
	}
	return id;
}

/**
 * Get the tweet Id from a link to its page
 * @param {WebElement} tweet Tweet where to look for the link
 * @returns {String} Id or empty string if the link wasn't found
 */
async function getTweetId(tweet) {
	let id = ""; // Expected that link to each post looks like this: 'https://twitter.com/{username}/status/123213132341432'
	const regex = /\/status\/(\d+)/;
	try {
		// Try to find the link with id element
		const linkElement = await webdriver.wait(
			until.elementLocated(() => {
				return tweet.findElement(By.css(profile.tweetId));
			}, 3000),
		);
		// Get the link value
		const idLink = await linkElement.getAttribute("href");

		id = idLink.match(regex);
		// If id was found the length shoud be 2 (0: matching part, 1: captured group)
		if (id?.length === 2) {
			id = id[1];
		} else {
			id = "";
		}
	} catch (error) {
		logger.error("Failed to find tweet Id", {
			_module: "retwitter",
			_function: "getTweetId",
		});
	}
	return id;
}

/**
 * Get the username of the user who made the tweet from the link to his page
 * @param {WebElement} tweet Tweet where to look for the username
 * @returns {String} Username of tweet owner or empty string if the username wasn't found
 */
async function getUsername(tweet) {
	let link = "";
	try {
		// Try to find the link element for the user profile
		const linkElement = await webdriver.wait(
			until.elementLocated(() => {
				return tweet.findElement(By.css(`${profile.profileUserAvatar} a`));
			}),
			3000,
		);
		// Get the link value
		link = await linkElement.getAttribute("href");
	} catch (error) {
		logger.error("Failed to find user avatar", {
			_module: "retwitter",
			_function: "getUsername",
		});
	}
	// Extract username from the link
	return link.replace("https://twitter.com/", "");
}

/**
 * Get total number of medias of the currently open profile
 * @returns {Number} Number of medias or 0 if parsing failed
 */
async function getNumberFromFeedHeader() {
	// Execute script in the context of the current frame
	// Extract text from the header overlay of the profile page
	const divText = await webdriver.executeScript(
		`const feedHeader = document.querySelector('${profile.feedHeader}');
		return feedHeader.textContent;`,
	);
	// Get the first number entry in a string
	const matchArr = divText.match(/\d+/);
	if (!matchArr) {
		logger.error(`Failed to parse medias number of ${username} profle`, {
			_module: "retwitter",
			_function: "getNumberOfTweets",
		});
	}
	return matchArr ? parseInt(matchArr[0]) : 0;
}
