const { Builder, Browser } = require("selenium-webdriver");
const { ServiceBuilder, Options } = require("selenium-webdriver/chrome");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

let driver;

exports.init = async function init(proxy) {
	driver = await createChromeDriver(proxy);
	// await driver.executeScript(
	// 	"Object.defineProperty(navigator, 'webdriver', {get: () => undefined})",
	// );

	await driver
		.manage()
		.window()
		.setRect({ width: 1920 / 2, height: 1080, x: 0, y: 0 });

	return driver;
};

exports.destroy = async function destroy() {
	await driver.quit();
};

function createProxyExtension(proxy) {
	const manifest = `
    {
        "manifest_version": 3,
        "version": "1.0.0",
        "name": "Chrome Proxy",
        "permissions": ["proxy", "webRequest", "webRequestAuthProvider", "storage"],
	    "host_permissions": ["<all_urls>"],
	    "background": {
	        "service_worker": "serviceWorker.js"
	    }
    }
    `;
	const serviceWorker = `
    const config = {
        mode: "fixed_servers",
        rules: {
            singleProxy: {
                scheme: "${proxy.scheme}",
                host: "${proxy.host}",
                port: ${proxy.port},
            },
            bypassList: ["localhost"],
        },
    };
    
    chrome.proxy.settings.set({ value: config, scope: "regular" }, () => {});
    
    function callbackFn(details) {
        return {
            authCredentials: {
                username: "${proxy.username}",
                password: "${proxy.password}",
            },
        };
    }
    
    chrome.webRequest.onAuthRequired.addListener(callbackFn, { urls: ["<all_urls>"] }, ["blocking"]);    
    `;

	const folderPath = `${path.resolve(".")}/1`;
	const manifestPath = `${folderPath}/manifest.json`;
	const serviceWorkerPath = `${folderPath}/serviceWorker.js`;

	if (!fs.existsSync(folderPath)) {
		fs.mkdirSync(folderPath);
	}
	fs.writeFileSync(manifestPath, manifest);
	fs.writeFileSync(serviceWorkerPath, serviceWorker);

	return folderPath;
}

async function createChromeDriver(proxy) {
	const chromeService = new ServiceBuilder(process.env.CHROME_DRIVER_PATH);
	const chromeOptions = new Options();

	// chromeOptions.addArguments("--headless=new");
	chromeOptions.setChromeBinaryPath(process.env.CHROME_PATH);
	chromeOptions.addArguments("--disable-blink-features=AutomationControlled");
	chromeOptions.addArguments(`--load-extension=${createProxyExtension(proxy)}`);
	chromeOptions.excludeSwitches(["enable-automation", "useAutomationExtension=false"]);

	return await new Builder()
		.forBrowser(Browser.CHROME)
		.setChromeService(chromeService)
		.setChromeOptions(chromeOptions)
		.build();
}
