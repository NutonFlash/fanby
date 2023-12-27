module.exports = {
	login: {
		selectors: {
			loginButton: 'a[href="/login"]',
			usernameInput: 'input[autocomplete="username"]',
			passwordInput: 'input[autocomplete="current-password"]',
		},
	},
	conversation: {
		selectors: {
			conversationContainer: 'div[data-testid="DmActivityContainer"]',
			conversationTotalHeightContainer: 'div[data-testid="DmScrollerContainer"]',
			conversationScrollContainer: 'div[data-testid="DmActivityViewport"]',
			messageContainer: 'div[data-testid="cellInnerDiv"]',
			messageText: 'div[data-testid="tweetText"]',
			conversationUserAvatar: 'div[data-testid*="avatar" i]',
			compositeMessage: 'div[data-testid="DMCompositeMessage"]',
			messagePicture: 'div[data-testid="image"]',
			fullScreenImage: 'div[data-testid="swipe-to-dismiss"]',
			fullScreenImageCloseButton: 'div[aria-label="Close"]',
		},
	},
	profile: {
		selectors: {
			profileScrollContainer: "html",
			primaryColumn: 'div[data-testid="primaryColumn"]',
			tweet: 'article[data-testid="tweet"]',
			tweetId: 'a[href*="/status"]',
			pinContainer: 'div[data-testid="socialContext"]',
			profileUserAvatar: 'div[data-testid*="avatar" i]',
			tweetRightTopButton: 'div[data-testid="caret"]',
			headerOverlay: 'div[data-testid="primaryColumn"] div div:first-child',
			retweetButton: 'div[data-testid="retweet"]',
			retweetConfirmButton: 'div[data-testid="retweetConfirm"]',
			unretweetButton: 'div[data-testid="unretweet"]',
			unretweetConfirmButton: 'div[data-testid="unretweetConfirm"]',
		},
	},
	sidebar: {
		selectors: {
			home: 'header nav a[href="/home"]',
			explore: 'header nav a[href="/explore"]',
			notifications: 'header nav a[href="/notifications"]',
			messages: 'header nav a[href="/messages"]',
			lists: (username) => `header nav a[href="/${username}/lists"]`,
			communities: (username) => `header nav a[href="/${username}/communities"]`,
			profile: (username) => `header nav a[href="/${username}"]`,
		},
	},
	dialog: {
		selectors: {
			mask: 'div[data-testid="mask"]',
			dialogContainer: 'div[data-testid="sheetDialog"]',
			closeButton: 'div[data-testid="app-bar-close"]',
			backButton: 'div[data-testid="app-bar-back"]',
		},
	},
};
