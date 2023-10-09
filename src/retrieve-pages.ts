
import * as vscode from 'vscode';
import axios from 'axios';
// import api, { route } from "@forge/api";

export async function retrieveConfluencePages() {
    try {
        const accessToken = process.env.ATLASSIAN_ACCESS_TOKEN;

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
    } catch (error: any) {
        vscode.window.showErrorMessage('Error retrieving Confluence pages: ' + error.message);
    }
};