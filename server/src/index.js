require('dotenv').config();
// const executor = require("./services/executor");
const http = require('http');
const _app = require('./app');
const _wss = require('./wss');

const PORT = process.env.APP_PORT || 3000;

async function main() {
  const app = _app.init();
  const server = http.createServer(app);
  server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
    const wss = _wss.init(server);
  });
  // const reqs = [
  //   {
  //     config: {
  //       account: {
  //         username: "7dropdrop",
  //         password: "Sahalox2",
  //       },
  //       // proxy: null,
  //       proxy: {
  //         scheme: "http",
  //         host: "rotating.proxyempire.io",
  //         port: 9000,
  //         username: "4wuQhX8Zd6KLYXqm",
  //         password: "wifi;us;;;",
  //       },
  //     },
  //     request: {
  //       // groups: [],
  //       groups: [
  //         {
  //           id: "1733482601757696224",
  //           messagesNumber: 40,
  //         },
  //         {
  //           id: "1689120998371536896",
  //           messagesNumber: 40,
  //         },
  //         {
  //           id: "1666419592028356608",
  //           messagesNumber: 40,
  //         },
  //       ],
  //       own: 0,
  //     },
  //   },
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
  // ];
  // for (req of reqs) {
  //   await executor.init(req.config);
  //   await executor.process(req.request);
  //   executor.destroy();
  // }
}
main();
