const { By, until } = require("selenium-webdriver");
const { profile, sidebar, dialog } = require("./twitterStructure");
const { closeDialog, scrollTo, delay, scrollIntoView } = require("./utils");

let driver;
let logger;
let username;
const selectors = { ...profile.selectors, ...sidebar.selectors, ...dialog.selectors };

exports.init = (_driver, _logger, _username) => {
	driver = _driver;
	username = _username;
	logger = _logger;
};

/**
 * Retweet pinned tweet from the user page
 * @param {String} userLink Link to the user page
 */
exports.retweetPinned = async function retweetPinned(userLink) {
	// Go to the user page
	await driver.get(userLink);
	// Get first tweet from the page (usually pinned)
	const tweet = await driver.wait(until.elementLocated(By.css(selectors.tweet)), 15000);

	// Make the retweet
	if (await isRetweeted(tweet)) {
		await unretweet(tweet);
	}
	await retweet(tweet);
};

/**
 * Retweet given number of own tweets
 * @param {Number} retweetNumber Number of tweets to retweet
 * @returns {Number} Number of sucessfully retweeted tweets
 */
exports.retweetMy = async function retweetOwn(retweetNumber) {
	await driver.get(`https://twitter.com/${username}`);
	// Initialize set of visited tweets that will preserve their Id
	const visitedTweets = new Set();
	// Initialize counter of successfully retweeted tweets
	let retweetCounter = 0;
	// Find WebElement of the header that overlays tweets feed
	const headerOverlay = await driver.wait(
		until.elementLocated(By.css(selectors.headerOverlay)),
		5000,
	);
	// Get header height to avoid tweets overlaying
	const { height: headerOverlayHeight } = await headerOverlay.getRect();
	// Get total number of tweets in the feed
	let postsNumber = await getNumberOfTweets();
	// Iterate through tweets until all tweets were visited or needed number of retweets were achieved
	while (retweetCounter < retweetNumber && visitedTweets.size < postsNumber) {
		const tweets = await driver.wait(until.elementsLocated(By.css(selectors.tweet), 5000));

		const filteredTweets = [];
		// Exclude already visited tweets
		for (tweet of tweets) {
			const id = await getTweetId(tweet);

			if (!visitedTweets.has(id)) {
				filteredTweets.push(tweet);
			}
		}
		// If unvisited tweets can't be find scroll down to the last available tweet
		if (filteredTweets.length === 0) {
			// Get last the available tweet
			const { height, x, y } = await tweets.pop().getRect();
			// Scroll to the bottom of that tweet in order to make new tweets available
			await scrollTo(selectors.profileScrollContainer, x, y + height);
			await delay(3000);
			continue;
		}

		for (tweet of filteredTweets) {
			let isNeedBreak = false;

			const id = await getTweetId(tweet);
			// Chech if the tweet is own and not pinned
			if ((await isMyTweet(tweet)) && !(await isPinnedTweet(tweet))) {
				// Check if the tweet is already retweeted
				if (await isRetweeted(tweet)) {
					try {
						const { x, y } = await tweet.getRect();
						// Scroll to the up side of the tweet in order to click and open it
						await scrollTo(selectors.profileScrollContainer, x, y - headerOverlayHeight);
					} catch (error) {
						break;
					}

					await reretweetOwn(tweet);

					// Increment retweet counter
					retweetCounter++;
					// Decrement posts number (total posts number counts retweeted tweets twice)
					postsNumber--;
					// After the refreshing of the page we need to get new WebElements of the tweets
					isNeedBreak = true;
				} else {
					// Retweet the tweet
					await retweet(tweet);
					// Increment retweet counter
					retweetCounter++;
				}
			}

			// Add the tweet id to visited tweets set
			visitedTweets.add(id);

			if (isNeedBreak) break;
		}

		// Scroll to the last availabe tweet
		await scrollIntoView(tweets.pop());
		// Make a delay in order to give time for new tweets to be created
		await delay(3000);
	}

	// Return the number of successfully retweeted tweets
	return retweetCounter;
};

/**
 * Determine whether tweet is retweeted or not
 * @param {WebElement} tweet Tweet to determine
 * @returns {Boolean} Return true or false
 */
async function isRetweeted(tweet) {
	let isRetweeted = false;
	try {
		await driver.wait(
			until.elementLocated(() => {
				return tweet.findElement(By.css(selectors.retweetButton));
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
async function retweet(tweet) {
	try {
		await closeDialog();
		// Get retweet button
		const retweetButton = await driver.wait(
			until.elementLocated(() => {
				return tweet.findElement(By.css(selectors.retweetButton));
			}),
			3000,
		);
		// Click retweet button to open actions menu
		await retweetButton.click();

		await closeDialog();
		// Get retweet confirm button
		const retweetConfirmButton = await driver.wait(
			until.elementLocated(By.css(selectors.retweetConfirmButton)),
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
async function unretweet(tweet) {
	try {
		await closeDialog();
		// Get unretweet button
		const unretweetButton = await driver.wait(
			until.elementLocated(() => {
				return tweet.findElement(By.css(selectors.unretweetButton));
			}),
			3000,
		);
		// Click unretweet button to open actions menu
		await unretweetButton.click();

		await closeDialog();
		// Get unretweet confirm button
		const unretweetConfirmButton = await driver.wait(
			until.elementLocated(By.css(selectors.unretweetConfirmButton)),
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
 * Go to the page of the tweet, unretweet it and then retweet it agian, go back to the user profile page
 * @param {WebElement} tweet Tweet to reretweet
 */
async function reretweetOwn(tweet) {
	try {
		// Get right top button of the tweet
		const tweetRightTopButton = await driver.wait(
			until.elementLocated(() => {
				return tweet.findElement(By.css(selectors.tweetRightTopButton));
			}),
			3000,
		);

		const { width } = await tweetRightTopButton.getRect();

		await closeDialog();

		// Move to the left of the button and click to go to the tweet page
		await driver
			.actions()
			.move({
				origin: tweetRightTopButton,
				x: -width,
				y: 0,
			})
			.click()
			.perform();

		// Get recreated tweet after page loading
		let recreatedTweet = await driver.wait(until.elementLocated(By.css(selectors.tweet)), 5000);
		// Unretweet already retweeted tweet
		await unretweet(recreatedTweet);
		// Refresh the page (Twitter doesn't allow to instantly retweet unretweeted tweet)
		await driver.navigate().refresh();
		// Get recreated tweet after page loading
		recreatedTweet = await driver.wait(until.elementLocated(By.css(selectors.tweet)), 5000);
		// Retweet unretweeted tweet
		await retweet(recreatedTweet);

		await closeDialog();
		// Get back button
		const backButton = await driver.wait(until.elementLocated(By.css(selectors.backButton)), 3000);
		// Click back button to return to the profile page
		await backButton.click();

		await delay(3000);
	} catch (error) {
		logger.error("Failed to retweet already retweeted tweet", {
			_module: "retwitter",
			_function: "reretweetMy",
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
		await driver.wait(
			until.elementLocated(() => {
				return tweet.findElement(By.css(selectors.pinContainer));
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
 * Get the username of the user who made the tweet from the link to his page
 * @param {WebElement} tweet Tweet where to look for the username
 * @returns {String} Username of tweet owner or empty string if the username wasn't found
 */
async function getUsername(tweet) {
	let link = "";
	try {
		// Try to find the link element for the user profile
		const linkElement = await driver.wait(
			until.elementLocated(() => {
				return tweet.findElement(By.css(`${selectors.profileUserAvatar} a`));
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
 * Get the tweet Id from a link to its page
 * @param {WebElement} tweet Tweet where to look for the link
 * @returns {String} Id or empty string if the link wasn't found
 */
async function getTweetId(tweet) {
	let id = "";
	// Expected that link to each post looks like this: 'https://twitter.com/username/status/123213132341432'
	const regex = /\/status\/(\d+)/;
	try {
		// Try to find the link with id element
		const linkElement = await driver.wait(
			until.elementLocated(() => {
				return tweet.findElement(By.css(selectors.tweetId));
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
 * Get total number of posts of the currently open profile
 * @returns {Number} Number of posts or 0 if parsing failed
 */
async function getNumberOfTweets() {
	// Execute script in the context of the current frame
	// Extract text from the header overlay of the profile page
	const divText = await driver.executeScript(
		`const headerOverlay = document.querySelector('${selectors.headerOverlay}');
		return headerOverlay.textContent;`,
	);
	// Get the first number entry in a string
	const matchArr = divText.match(/\d+/);
	if (!matchArr) {
		logger.error(`Failed to parse posts number of ${username} profle`, {
			_module: "retwitter",
			_function: "getNumberOfTweets",
		});
	}
	return matchArr ? parseInt(matchArr[0]) : 0;
}
