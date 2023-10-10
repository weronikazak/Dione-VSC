
const vscode = require('vscode');
const axios = require('axios');
// const ATLASSIAN_ACCESS_TOKEN = require('./global.js');
// require('dotenv').config();

const retrieveConfluencePages = async function retrieveConfluencePages(context) {
    try {
        const accessToken = await vscode.window.showInputBox(
            {
                placeHolder: 'Access Token',
                prompt: 'Paste your Access Token',
        });

        console.log('accessToken ' + accessToken);
        
        if (!accessToken) {
            vscode.window.showErrorMessage('Access token not found. Please log in.');
            return;
        }

        console.log('sending response...');

        // Use the access token to make API requests to Confluence
        const response = await axios.get('https://dioneplugin.com/wiki/api/v2/pages', {
            headers: {
                Authorization: `Basic ${Buffer.from(
                    `email@example.com:${accessToken}}`
                  ).toString('base64')}`,
                Accept: 'application/json',
            },
        });

        console.log('response ' + response);

        // Process and display the retrieved Confluence pages
        const pages = response.data.pages;
        console.log('pages ' + pages);
        vscode.window.showInformationMessage(`Retrieved ${pages.length} Confluence pages.`);
    } catch (error) {
        vscode.window.showErrorMessage('Error retrieving Confluence pages: ' + error);
    }
};

module.exports = retrieveConfluencePages;