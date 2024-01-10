
    const config = {
        mode: "fixed_servers",
        rules: {
            singleProxy: {
                scheme: "http",
                host: "91.239.130.34",
                port: 12321,
            },
            bypassList: ["localhost"],
        },
    };
    
    chrome.proxy.settings.set({ value: config, scope: "regular" }, () => {});
    
    function callbackFn(details) {
        return {
            authCredentials: {
                username: "randomusernamenutonflash",
                password: "randompassword_country-us_session-3sWSWK9k_lifetime-1h",
            },
        };
    }
    
    chrome.webRequest.onAuthRequired.addListener(callbackFn, { urls: ["<all_urls>"] }, ["blocking"]);    
    