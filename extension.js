const vscode = require('vscode');
const retrieveConfluencePages = require('./retrieve-pages');
const authenticate = require('./authenticate');
const codify = require('./codify');

/**
 * @param {vscode.ExtensionContext} context
 */

function activate(context) {

    context.subscriptions.push(vscode.commands.registerCommand('dione.codify', async() => {await codify()}));
	context.subscriptions.push(vscode.commands.registerCommand('dione.authenticate', authenticate));
	context.subscriptions.push(vscode.commands.registerCommand('dione.listPages', () => {retrieveConfluencePages(context)}));
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
