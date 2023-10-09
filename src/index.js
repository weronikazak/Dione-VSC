const express = require( "express" );
const axios = require( "axios" );

const app = express();
const port = 8000;

const atlassianClientId = "ORuHfUtA7BUvMeNwMNz1hYQX0s8ZPh8w";
const atlassianClientSecret = "ATOA8F6OJyEA16Tci7Z7v79VmXTW2lF9PxKx5OntjTR-V-5FMdQeylyHaFoahXiDRmvmA9E150CA";
const atlassianRedirectUri = "http://localhost:8000/callback/";

app.get('/callback', async (req, res) => {
const { code } = req.query;

if (!code) {
    return res.status(400).send('Missing authorization code');
}
// console.log('code ' + code);
try {
    const tokenResponse = await axios.post('https://auth.atlassian.com/oauth/token', {
            client_id: atlassianClientId,
            client_secret: atlassianClientSecret,
            code: code,
            grant_type: 'authorization_code',
            redirect_uri: atlassianRedirectUri,
    });

    const accessToken = tokenResponse.data.access_token;

    // console.log('accessToken ' + accessToken);

    process.env.ATLASSIAN_ACCESS_TOKEN = accessToken;
    // Store the access token securely using VS Code secrets API
    // const secretStorage = vscode.workspace.getConfiguration().get('secrets');
    // await secretStorage.store('atlassian-access-token', accessToken);

    res.send('Login successful. You can close this window.');
} catch (error) {
    res.status(500).send('Error logging in: ' + error);
}

});

app.listen(port, () => {
  console.log(`Listening for OAuth callback on port ${port}`);
});
