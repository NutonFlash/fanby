const executor = require("./executor");

async function main() {
	const reqs = [
		{
			config: {
				account: {
					username: "7dropdrop",
					password: "Sahalox2",
				},
				proxy: {
					scheme: "http",
					host: "91.239.130.34",
					port: 12321,
					username: "randomusernamenutonflash",
					password: "randompassword_country-us_session-3sWSWK9k_lifetime-1h",
				},
			},
			request: {
				groups: [],
				// groups: [
				// 	{
				// 		id: "1679945635250819073",
				// 		messagesNumber: 5,
				// 	},
				// 	{
				// 		id: "1727253401547800738",
				// 		messagesNumber: 5,
				// 	},
				// 	{
				// 		id: "1666419592028356608",
				// 		messagesNumber: 5,
				// 	},
				// ],
				own: 5,
			},
		},
		// {
		// 	options: {
		// 		username: "dropdrop_5",
		// 		password: "Sahalox2",
		// 		proxy:
		// 			"socks5://MsGqKCw3wTX4RoC835PdXZNr91zUgU:c5m5DazexI99jLab_country-kr_session-Rx2qyfkJ_lifetime-1h@proxy.digiproxy.cc:8083",
		// 	},
		// 	groups: [
		// 		{
		// 			id: "1725500302185406830",
		// 			messagesNumber: 3,
		// 		},
		// 		{
		// 			id: "1719635426057630200",
		// 			messagesNumber: 5,
		// 		},
		// 		{
		// 			id: "1730563812057895261",
		// 			messagesNumber: 5,
		// 		},
		// 	],
		// 	own: 5,
		// },
	];

	for (req of reqs) {
		await executor.init(req.config);
		await executor.process(req.request);
		executor.destroy();
	}
}
main();
