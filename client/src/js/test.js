import { TwitterApi } from 'twitter-api-v2';
import 'dotenv/config'

// OAuth 1.0a (User context)
let client = new TwitterApi({
  appKey: process.env.API_KEY,
  appSecret: process.env.API_KEY_SECRET,
  // Following access tokens are not required if you are
  // at part 1 of user-auth process (ask for a request token)
  // or if you want a app-only client (see below)
//   accessToken: process.env.ACCESS_TOKEN,
//   accessSecret: process.env.ACCESS_TOKEN_SECRET,
});

// const meUser = await v2Client.me();
// console.log(meUser)
let some_data = await authUser(client);

console.log(client.v2.me());

async function authUser(client) {
    const callback_url = 'http://127.0.0.1:3000'
    const authLink = await client.generateAuthLink(callback_url);
    const outhToken = authLink.oauth_token;
    const oauth_token_secret = authLink.oauth_token_secret;
    console.log('Go to this url to athorize:\n' + authLink.url);
    let oauth_verifier = null;
    readline.question('Enter oauth_verifier:', verifier => {
        oauth_verifier = verifier;
        readline.close();

        // Obtain the persistent tokens
        // Create a client from temporary tokens
        client = new TwitterApi({
            appKey: process.env.API_KEY,
            appSecret: process.env.API_KEY_SECRET,
            accessToken: outhToken,
            accessSecret: oauth_token_secret,
        });

        client.login(oauth_verifier).then((response) => {
            console.log(response)
        return { client: response.loggedClient, token: response.accessToken, secret: response.accessSecret }
        }).catch(() => res.status(403).send('Invalid verifier or access tokens!'));
    });
}