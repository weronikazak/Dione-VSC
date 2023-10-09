import * as vscode from "vscode";
import axios from "axios";
import { retrieveConfluencePages } from './retrieve-pages';

function generateUID(): string {
  // I generate the UID from two parts here
  // to ensure the random number provide enough bits.
  var firstPart = (Math.random() * 46656) | 0;
  var secondPart = (Math.random() * 46656) | 0;
  firstPart = parseInt(("000" + firstPart.toString(36)).slice(-3));
  secondPart = parseInt(("000" + secondPart.toString(36)).slice(-3));
  return firstPart.toString() + secondPart.toString();
}

// Function to open the Atlassian OAuth 2.0 authorization URL in a webview popup
async function openExternalBrowserForAuthentication() {
  const YOUR_USER_BOUND_VALUE = generateUID();
  const authorizationUrl = `https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=ORuHfUtA7BUvMeNwMNz1hYQX0s8ZPh8w&scope=write%3Aconfluence-content%20search%3Aconfluence%20read%3Aconfluence-content.all&redirect_uri=http%3A%2F%2Flocalhost%3A8000%2Fcallback%2F&state=${YOUR_USER_BOUND_VALUE}&response_type=code&prompt=consent`;

  // Open the URL in an external browser
  vscode.env.openExternal(vscode.Uri.parse(authorizationUrl)).then((response) => {
    console.log('response ' + response);
});
}

// Register a command to initiate authentication
const disposable = vscode.commands.registerCommand("dione.authenticate", () => {
  openExternalBrowserForAuthentication();
});

// Activate the extension
function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(disposable);
  context.subscriptions.push(vscode.commands.registerCommand('dione.listPages', retrieveConfluencePages));
}
exports.activate = activate;

// Deactivate the extension
function deactivate() {}
exports.deactivate = deactivate;
